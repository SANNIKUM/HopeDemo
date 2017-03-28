require 'rails_helper'


describe CreateFormValue do

  def subject(form_field_data)
    CreateFormValue.run(form_field_data)
  end

  it 'creates string form value' do
    form_field_data = {
      name: 'firstName',
      field_type: 'string',
      value: 'jon',
    }
    form_value = subject(form_field_data)
    expect(form_value.id).to be_present
    expect(form_value.string_value).to eq('jon')
    expect(form_value.form_field.field_type).to eq('string')
  end

  it 'creates integer form value' do
    form_field_data = {
      name: 'age',
      field_type: 'integer',
      value: '80',
    }
    form_value = subject(form_field_data)
    expect(form_value.id).to be_present
    expect(form_value.integer_value).to eq(80)
    expect(form_value.form_field.field_type).to eq('integer')
  end

  it 'creates boolean form value' do
    form_field_data = {
      name: 'canning',
      field_type: 'boolean',
      value: true
    }
    form_value = subject(form_field_data)
    expect(form_value.id).to be_present
    expect(form_value.boolean_value).to eq(true)
    expect(form_value.form_field.field_type).to eq('boolean')
  end


  it 'creates option value' do
    form_field_data = {
      name: 'provider',
      field_type: 'option',
      value: 'provider1'
    }
    form_value = subject(form_field_data)
    expect(form_value.id).to be_present
    expect(form_value.form_value_option.id).to be_present
    expect(form_value.form_value_option.value).to eq('provider1')
  end
end













