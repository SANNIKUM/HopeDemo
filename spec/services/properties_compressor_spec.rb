require 'rails_helper'

describe PropertiesCompressor do

  def subject(*args)
    PropertiesCompressor.run(*args)
  end

  def fc(*args)
    FactoryGirl.create(*args)
  end

  let!(:assignment1) { fc(:assignment, name: 'assignment1') }

  let!(:assignment_property_type1) { fc(:assignment_property_type,
                                        name: 'assignment_property_type1',
                                        is_singleton: true) }

  let!(:assignment_property_type2) { fc(:assignment_property_type,
                                        name: 'assignment_property_type2',
                                        is_singleton: false) }

  let!(:assignment_property1) { fc(:assignment_property,
                                        assignment_property_type: assignment_property_type1,
                                        value: 'value1') }

  let!(:assignment_property2) { fc(:assignment_property,
                                        assignment_property_type: assignment_property_type2,
                                        value: 'value2') }

  it 'works' do
    result = subject({arr: [assignment_property1, assignment_property2], type_name: 'assignment_property_type'})
    expect(result.deep_symbolize_keys!).to eq({
        assignment_property_type1: 'value1',
        assignment_property_type2: ['value2']
    })
  end
end
