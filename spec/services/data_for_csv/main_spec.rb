require 'rails_helper'

describe DataForCsv::Main do

  def fc(*args) FactoryGirl.create(*args) end
  def subject() DataForCsv::Main.run('asg1') end

  let!(:sf) { fc(:submitted_form, request_id: '1') }
  let!(:at) { fc(:assignment_type, name: 'at1') }
  let!(:asg) { fc(:assignment, name: 'asg1', assignment_type: at) }
  let!(:ff) { fc(:form_field, name: 'at1', field_type: 'assignment', assignment_type: at) }
  let!(:fvo) { fc(:form_value_option, assignment: asg) }
  let!(:fv) { fc(:form_value, form_field: ff, form_value_option: fvo, submitted_form: sf) }


  it 'works for assignment' do
    result = subject
    expect(result).to eq([
      ['requestId', 'at1'],
      ['1', 'asg1']
    ])
  end

  it 'works with assignment_properties' do
    apt = fc(:assignment_property_type, name: 'apt1')
    ap = fc(:assignment_property, assignment: asg, assignment_property_type: apt, value: 'ap_value1')
    result = subject
    expect(result).to eq([
      ['requestId', 'at1', 'at1: apt1'],
      ['1', 'asg1', 'ap_value1']
    ])
  end

  it 'works for string' do
    ff2 = fc(:form_field, name: 'sf1', field_type: 'string')
    fv = fc(:form_value, string_value: 'sv1', submitted_form_id: sf.id, form_field: ff2)
    result = subject
    expect(result).to eq([
        ['requestId', 'at1', 'sf1'],
        ['1', 'asg1', 'sv1']
    ])
  end

  it 'works for boolean' do
    ff2 = fc(:form_field, name: 'bf1', field_type: 'boolean')
    fv = fc(:form_value, boolean_value: false, submitted_form_id: sf.id, form_field: ff2)
    result = subject
    expect(result).to eq([
        ['requestId', 'at1', 'bf1'],
        ['1', 'asg1', false]
    ])
  end

  it 'works for option' do
    ff2 = fc(:form_field, name: 'of1', field_type: 'option')
    fvo = fc(:form_value_option, value: 'option1')
    fv = fc(:form_value, form_value_option: fvo, submitted_form_id: sf.id, form_field: ff2)
    result = subject
    expect(result).to eq([
        ['requestId', 'at1', 'of1'],
        ['1', 'asg1', 'option1']
    ])
  end

  it 'works for time' do
    ff2 = fc(:form_field, name: 'tf1', field_type: 'time')
    value = 1485551714442
    dt = DateTime.parse Time.at(value.to_i/1000).to_s
    fv = fc(:form_value, datetime_value: dt, submitted_form_id: sf.id, form_field: ff2)
    result = subject
    expect(result).to eq([
        ['requestId', 'at1', 'tf1'],
        ['1', 'asg1', '01/27/2017 16:15 PM']
    ])
  end
end
