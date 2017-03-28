class SubmittedForm < ApplicationRecord
  belongs_to :form_type
  belongs_to :user
  has_many :form_values, dependent: :nullify

  def user_name
    at = AssignmentType.find_by(name: 'user')
    form_values = FormValue.where(submitted_form_id: self.id)
    fvos = FormValueOption.where(id: form_values.map(&:form_value_option_id))
    fvos2 = fvos.where.not(assignment_id: nil)
    asgs = Assignment.where(id: fvos2.map(&:assignment_id), assignment_type_id: at.id)
    asgs.first.name
  end
end
