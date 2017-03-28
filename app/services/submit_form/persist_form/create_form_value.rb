module SubmitForm::PersistForm::CreateFormValue

  def self.run(form_field_data)

    form_field_id = form_field_data[:form_field_id]
    input_type = form_field_data[:input_type]
    form_field_value = form_field_data[:value]


    form_field = FormField.find_by(id: form_field_id)

    form_value = self.helper(form_field, form_field_value, input_type)
    form_value.form_field = form_field
    form_value.save
    form_value
  end

  private

  def self.helper(form_field, value, input_type)
    field_type = form_field.field_type
    return self.handle_assignment(form_field, value, input_type) if field_type === 'assignment'
    return self.handle_option(form_field, value) if field_type === 'option'
    return self.handle_coordinates(form_field, value) if field_type === 'coordinates'
    return self.handle_time(value) if field_type === 'time'
    hash = {"#{field_type}_value": value}
    FormValue.create(hash)
  end

  def self.handle_assignment(form_field, value, input_type)
    assignment_type_id = form_field.assignment_type_id
    if input_type == 'string'
      assignment = Assignment.find_or_create_by(name: value, assignment_type_id: assignment_type_id)
    else
      assignment = Assignment.find(value)
    end
    value_option = FormValueOption.find_or_create_by(assignment_id: assignment.id)
    FormValue.create(form_value_option: value_option)
  end

  def self.handle_option(form_field, value)
    value_option = FormValueOption.find_by(id: value)
    FormValue.create(form_value_option: value_option)
  end

  def self.handle_coordinates(form_field, value)
    if form_field.name == 'latitude'
      FormValue.create(numeric_value_1: value)
    elsif form_field.name == 'longitude'
      FormValue.create(numeric_value_2: value)
    end
  end

  def self.handle_time(value)
    formatted = DateTime.parse Time.at(value.to_i/1000).to_s
    FormValue.create(datetime_value: formatted)
  end
end
