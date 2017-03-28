require 'date'

module SubmitForm::SwitchBasedCheckOut::Main

  def self.run(sf_id)
    ::SwitchBasedCheckOut.all.each do |x|
      self.run2(sf_id, x.target_assignment_type, x.helper_assignment_type)
    end
    sf_id
  end

  def self.run2(sf_id, at_target, at_helper)
    # get the route from the sf_id (which is just submitted)
    new_target_id = self.get_target_assignment_id(sf_id, at_target.name)
    return sf_id if new_target_id.nil?

    # find all the teams (or users) that were assigned to this route
    helper_ids = self.find_helper_ids(new_target_id, at_target, at_helper)

    # find all surveys submitted by these teams (or users) and return the most recent one
    last_sf_id = self.find_last_submitted_form(helper_ids, sf_id, at_target.name)

    # get the route's assignment id for the last submitted form
    last_target_id = self.get_target_assignment_id(last_sf_id, at_target.name)

    if last_target_id.nil?
      self.automatic_check_in(new_target_id, at_target.name)
    elsif new_target_id == last_target_id
      # nothing needs to be done
    elsif new_target_id != last_target_id
      self.automatic_check_out(last_target_id, at_target.name)
      self.automatic_check_in(new_target_id, at_target.name)
    end

    sf_id
  end

  def self.handle_target(ftc_name, target_id, target_name)
    ft_name = target_name + ftc_name[0].upcase + ftc_name[1..-1]

    ft = AssignmentType.find_by(name: 'formType')
    ftc = AssignmentType.find_by(name: 'formTypeCategory')
    target_type = AssignmentType.find_by(name: target_name)

    asg_ft = Assignment.find_or_create_by(name: ft_name, assignment_type: ft)
    asg_ftc = Assignment.find_or_create_by(name: ftc_name, assignment_type: ftc)

    ff_ft = FormField.find_or_create_by(name: 'formType', field_type: 'assignment', assignment_type: ft)
    ff_ftc = FormField.find_or_create_by(name: 'formTypeCategory', field_type: 'assignment', assignment_type: ftc)
    ff_target = FormField.find_or_create_by(name: target_name, field_type: 'assignment', assignment_type: target_type)
    ff_submitted_at = FormField.find_or_create_by(name: 'submittedAt', field_type: 'time')

    data = {
      request_id: rand.to_s,
      form_fields: [
        {value: asg_ftc.id, field_type: 'assignment', form_field_id: ff_ftc.id},
        {value: asg_ft.id, field_type: 'assignment', form_field_id: ff_ft.id},
        {input_type: 'option', field_type: 'assignment', value: target_id, form_field_id: ff_target.id},
        {value: DateTime.now.strftime('%Q').to_i, field_type: 'time', form_field_id: ff_submitted_at.id}
      ]
    }

    SubmitForm::PersistForm::Main.run(data)
  end

  def self.automatic_check_in(target_id, target_name)
    self.handle_target('checkIn', target_id, target_name)
  end

  def self.automatic_check_out(target_id, target_name)
    self.handle_target('checkOut', target_id, target_name)
  end

  def self.get_target_assignment_id(sf_id, target_name)
    return nil if sf_id.nil?

    query = <<-SQL
      SELECT form_value_options.assignment_id
        FROM submitted_forms
    	  JOIN form_values
          ON submitted_forms.id = form_values.submitted_form_id
    	  JOIN form_fields
          ON form_fields.id = form_values.form_field_id
        JOIN form_value_options
          ON form_values.form_value_option_id = form_value_options.id
    	 WHERE form_fields.name = '#{target_name}'
         AND submitted_forms.id = #{sf_id}
    SQL

    result = ActiveRecord::Base.connection.execute(query).map { |h| h["assignment_id"] }
    result.first
  end

  def self.find_helper_ids(target_id, at_target, at_helper)
    # i.e. it picks 'Team to Route' and 'Route to Team' relation
    arts = AssignmentRelationType.where(
      assignment_1_type: [at_helper, at_target],
      assignment_2_type: [at_target, at_helper]
    )

    result = []

    # get all the "teams"
    arts.each do |art|
      if art.assignment_1_type == at_helper
        target_number = 2
        helper_number = 1
      else
        target_number = 1
        helper_number = 2
      end

      query = <<-SQL
        SELECT assignment_#{helper_number}_id AS assignment_id
          FROM assignment_relations
         WHERE assignment_#{target_number}_id = #{target_id}
           AND assignment_relation_type_id = #{art.id}
      SQL

      result += ActiveRecord::Base.connection.execute(query).map { |h| h["assignment_id"] }
    end

    result.uniq
  end

  def self.find_last_submitted_form(helper_ids, sf_id, target_name)
    query = <<-SQL
      /* submitted forms by this teams */
      WITH table1 AS (
        SELECT form_values.submitted_form_id AS sf_id
          FROM form_values
          JOIN form_value_options
            ON form_values.form_value_option_id = form_value_options.id
          JOIN assignments
            ON form_value_options.assignment_id = assignments.id
         WHERE assignments.id IN (#{helper_ids.join(', ')})
      ),

      /* submitted_forms with route assignments*/
      table2 AS (
        SELECT submitted_forms.id AS sf_id, fv2.datetime_value as submitted_at
          FROM submitted_forms
          JOIN form_values AS fv1
            ON fv1.submitted_form_id = submitted_forms.id
          JOIN form_value_options
            ON fv1.form_value_option_id = form_value_options.id
          JOIN assignments
            ON form_value_options.assignment_id = assignments.id
          JOIN assignment_types
            ON assignments.assignment_type_id = assignment_types.id
          JOIN form_values AS fv2
            ON fv2.submitted_form_id = fv1.submitted_form_id
          JOIN form_fields
            ON fv2.form_field_id = form_fields.id
         WHERE form_fields.name = 'submittedAt'
           AND assignment_types.name = '#{target_name}'
      )

      SELECT table2.sf_id
      FROM table2
      JOIN table1
        ON table1.sf_id = table2.sf_id
      WHERE table2.sf_id <> #{sf_id}
      ORDER BY table2.submitted_at DESC
      LIMIT 1
    SQL

    result = ActiveRecord::Base.connection.execute(query).map { |h| h['sf_id'] }
    result.first
  end

end
