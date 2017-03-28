require 'rails_helper'

describe Serializers::UiItem do

  def subject(*args)
    Serializers::UiItem::MainProc.proc.call(*args).deep_symbolize_keys!
  end

  def fc(*args)
    FactoryGirl.create(*args)
  end

  let!(:form_field1) { fc(:form_field, name: 'form_field1', field_type: 'option') }

  let!(:ui_item_property_type1) { fc(:ui_item_property_type, name: 'ui_item_property_type1') }
  let!(:ui_item_property1) { fc(:ui_item_property, ui_item_property_type: ui_item_property_type1, value: 'value1') }

  let!(:sequenceForm) { fc(:ui_item_type, name: 'sequenceForm') }
  let!(:ui_item1) { fc(:ui_item, ui_item_type: sequenceForm, form_field: form_field1) }

  let!(:ui_item_property_relation) { fc(:ui_item_property_relation, ui_item: ui_item1, ui_item_property: ui_item_property1)}

  it 'works' do
    result = subject(ui_item1.id, [])
    expect(result).to eq({
      id: ui_item1.id,
      ui_item_property_type1: ['value1'],
      is_form_field: true,
      form_field: {
        id: form_field1.id,
        name: 'form_field1',
        field_type: 'option',
        label: nil,
        assignment_type_id: nil,
        form_value_options: [],
      }
    })
  end
end
