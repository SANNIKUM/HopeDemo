require 'rails_helper'

describe Serializers::Assignment::Main do

  def subject(*args)
    Serializers::Assignment::Main.run(*args)
  end

  let!(:assignment_type1) { FactoryGirl.create(:assignment_type, name: "assignment_type1")}
  let!(:assignment1) { FactoryGirl.create(:assignment, name: "assignment1", assignment_type: assignment_type1)}
  let!(:assignment_property_type1) { FactoryGirl.create(:assignment_property_type,
                                                        is_singleton: true,
                                                        name: 'assignment_property_type1')}
  let!(:assignment_property1) { FactoryGirl.create(:assignment_property,
                                                  value: 'value1',
                                                  assignment: assignment1,
                                                  assignment_property_type: assignment_property_type1) }

  it 'works' do
    result = subject(assignment1.id).deep_symbolize_keys!
    expect(result).to eq({
      id: assignment1.id,
      name: 'assignment1',
      label: nil,
      assignment_type_id: assignment_type1.id,
      assignment_property_type1: 'value1',
    })
  end
end
