module Serializers::UiItem::ComputedPropertiesProc

  def self.proc
    LiftAndComposeProc.proc(
      self.handle_assignment_type_proc,
      self.handle_is_form_proc,
      self.handle_assignments_proc,
      self.get_expected_form_fields_proc,
    )
  end


  private

  def self.handle_is_form_proc
    lambda do |hash|
      if self.form_ui_item_type_names.include?(hash[:uiItemType])
        result = {is_form: true}
      else
        result = {}
      end
      result
    end
  end

  def self.handle_assignment_type_proc
    lambda do |hash|
      if hash[:assignmentType].present?
        at = AssignmentType.find_by(name: hash[:assignmentType])
        asg = Assignment.find_by(id: hash[:assignment_ids], assignment_type_id: at.id)
        hash[:assignment] = Serializers::Assignment::Main.run(asg.id)
      end
      hash
    end
  end

  def self.handle_assignments_proc
    proc1 = lambda do |acc, asg_id|
      assignment_type = Assignment.find(asg_id).assignment_type
      ff = FormField.find_or_create_by(assignment_type_id: assignment_type.id, name: assignment_type.name, field_type: 'assignment')
      acc[ff.id] = asg_id
      acc
    end

    lambda do |hash|
      {assignments: Reduce.run({}, proc1, hash[:assignments] || [])}
    end
  end

  def self.get_expected_form_fields_proc
    proc1 = lambda do |acc, asg_id|
      ff_ids = ExpectedField.where(assignment_id: asg_id).map(&:form_field_id).compact
      acc2 = acc.concat(ff_ids).uniq
      acc2
    end

    lambda do |hash|
      {expected_form_field_ids: Reduce.run([], proc1, hash[:assignments] || [])}
    end
  end

  def self.form_ui_item_type_names
    %w(
      singlePageForm
      sequenceForm
      instantFormSubmitButton
    )
  end
end
