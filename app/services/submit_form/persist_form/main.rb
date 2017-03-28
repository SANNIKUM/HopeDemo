module SubmitForm::PersistForm::Main

  def self.run(data)
    submitted_form = SubmittedForm.find_or_create_by(request_id: data[:request_id])
    form_fields = (data[:form_fields].length > 1) ? data[:form_fields] : data[:form_fields].concat(trivial_form_fields)

    form_values = form_fields.map do |ff|
      self.create_form_value(ff)
    end
    submitted_form.form_values = form_values
    submitted_form.save
    submitted_form.reload
    submitted_form.id
  end

  private

  def self.create_form_value(form_field_data)
    SubmitForm::PersistForm::CreateFormValue.run(form_field_data)
  end

  def self.trivial_form_fields
    assignment_type = AssignmentType.find_or_create_by(name: 'formType')
    assignment = Assignment.find_or_create_by(name: 'blankStateAppOpen', assignment_type: assignment_type)
    form_field = FormField.find_or_create_by(name: 'formType', field_type: 'assignment', assignment_type: assignment_type)
    [
      {
        form_field_id: form_field.id,
        input_type: 'id',
        value: assignment.id
      }
    ]
  end
end
