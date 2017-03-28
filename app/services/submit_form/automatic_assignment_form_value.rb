module SubmitForm::AutomaticAssignmentFormValue

  def self.run(sf_id)
    asg_ids = self.collect_assignment_ids(sf_id)
    asgs = Assignment.where(id: asg_ids)
    at_ids = asgs.map(&:assignment_type_id)
    aafvs = ::AutomaticAssignmentFormValue.where({
        trigger_type_id: at_ids,
        target_type_id: at_ids
    })
    puts "asgs : #{asgs.to_json}"
    puts "aafvs : #{aafvs.to_json}"
    puts "at_ids: #{at_ids.to_json}"
    puts "all : #{::AutomaticAssignmentFormValue.all.to_json}"
    # Map.run(self.helper({sf_id: sf_id, asgs: asgs}), aafvs)
    aafvs.each do |aafv|
      self.helper({sf_id: sf_id, asgs: asgs}).call(aafv)
    end
    sf_id
  end

  private

  def self.helper(args)
    lambda do |aafv|
      target_asg = args[:asgs].find_by(assignment_type_id: aafv.target_type_id)
      ff = FormField.find_or_create_by(
        assignment_type_id: aafv.target_type_id,
        name: AssignmentType.find(aafv.target_type_id).name
      )
      fvo = FormValueOption.find_or_create_by(assignment_id: target_asg.id)
      fv = FormValue.create(
        submitted_form_id: args[:sf_id],
        form_value_option_id: fvo.id,
        form_field: ff
      )
    end
  end

  def self.collect_assignment_ids(*args)
    SubmitForm::CollectAssignmentIds.run(*args)
  end

end
