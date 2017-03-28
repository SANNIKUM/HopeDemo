require 'rails_helper'

describe Serializers::FormValueOption do

  let!(:assignment) { FactoryGirl.create(:assignment, name: 'assignment1') }
  let!(:form_value_option) { FactoryGirl.create(:form_value_option, assignment: assignment)}

  it 'works' do
    result = Serializers::FormValueOption::Main.run(form_value_option.id).deep_symbolize_keys!
    expect(result).to eq({
      id: form_value_option.id,
      value: nil,
      assignment_id: assignment.id,
      form_field_id: nil,
      assignment: {
        id: assignment.id,
        assignment_type_id: nil,
        label: nil,
        name: 'assignment1',
      }
    })
  end
end
