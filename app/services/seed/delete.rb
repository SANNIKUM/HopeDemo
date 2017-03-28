module Seed::Delete
  def self.run
    AccessSetRelation.delete_all
    AccessSet.delete_all
    AutomaticAssignment.delete_all
    AutomaticAssignmentFormValue.delete_all
    SwitchBasedCheckOut.delete_all

    FormFieldValueOption.delete_all
    SubmittedForm.delete_all
    FormValue.delete_all
    FormValueOption.delete_all#.where.not(assignment_id: nil).destroy_all

    HigherOrderAssignmentRelation.delete_all

    ExpectedField.delete_all
    FormField.delete_all

    AssignmentProperty.delete_all
    AssignmentPropertyType.delete_all
    AssignmentRelation.delete_all
    AssignmentRelationType.delete_all
    Assignment.delete_all
    AssignmentType.delete_all

    UiItemPropertyPropertyRelation.delete_all
    UiItemPropertyRelation.delete_all
    UiItemRelation.delete_all

    UiItem.delete_all

    UiItemProperty.delete_all
    UiItemPropertyType.delete_all

  end

end
