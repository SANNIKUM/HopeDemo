require 'rails_helper'

describe Serializers::FormField::Main do

  def subject(*args)
    Serializers::FormField::Main.run(*args).deep_symbolize_keys!
  end

  def fc(*args)
    FactoryGirl.create(*args)
  end

  let!(:assignment_type1) { fc(:assignment_type, name: 'assignment_type1')}
  let!(:assignment1) { fc(:assignment, name: 'assignment1', assignment_type: assignment_type1) }
  let!(:assignment2) { fc(:assignment, name: 'assignment2', assignment_type: assignment_type1) }

  let!(:assignment_ids) { [assignment1.id] }

  let!(:form_field1) { fc(:form_field, name: 'form_field1', field_type: 'option') }
  let!(:form_value_option1) { fc(:form_value_option, value: 'form_value_option1') }
  let!(:form_field_value_option1) { fc(:form_field_value_option, form_field: form_field1, form_value_option: form_value_option1)}

  it 'works for non-assignment form_field' do
    result = subject(form_field1.id, assignment_ids)
    expect(result).to eq({
        id: form_field1.id,
        name: 'form_field1',
        field_type: 'option',
        label: nil,
        assignment_type_id: nil,
        form_value_options: [
          {
            id: form_value_option1.id,
            value: 'form_value_option1',
            assignment_id: nil,
            assignment: nil,
            form_field_id: nil
          }
        ]
    })
  end

  let!(:form_field2) { fc(:form_field, name: "form_field2", field_type: 'assignment', assignment_type: assignment_type1) }

  it 'works for assignment form_field' do
    result = subject(form_field2.id, assignment_ids)
    result[:form_value_options] = result[:form_value_options].map do |x|
      x[:id] = nil
      x
    end
    expect(result).to eq({
        id: form_field2.id,
        name: 'form_field2',
        field_type: 'assignment',
        label: nil,
        assignment_type_id: assignment_type1.id,
        form_value_options: [
            {
              id: nil,
              value: nil,
              assignment_id: assignment1.id,
              assignment: {
                id: assignment1.id,
                assignment_type_id: assignment_type1.id,
                name: 'assignment1',
                label: nil
              },
              form_field_id: nil
            }
        ]
    })
  end

end
