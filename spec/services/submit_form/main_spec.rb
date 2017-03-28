require 'rails_helper'

describe SubmitForm::Main do

  def subject(*args) SubmitForm::Main.run(*args).deep_symbolize_keys! end
  def fc(*args) FactoryGirl.create(*args) end

  let!(:at)  { fc(:assignment_type) }
  let!(:ff)  { fc(:form_field, field_type: 'assignment', assignment_type_id: at.id) }
  let!(:asg) { fc(:assignment, assignment_type: at) }
  let!(:ui)  { fc(:ui_item) }
  let!(:au)  { fc(:assignment_ui_item, ui_item: ui, assignment: asg) }

  let!(:data) do
    {
      request_id: 1,
      form_fields: [
        {
          form_field_id: ff.id,
          input_type: 'id',
          value: asg.id,
        }
      ]
    }
  end

  it 'works' do
    result = subject(data)
    expect(result).to eq({
      ui_items: [{id: ui.id}],
      ui_item_relations: []
    })
  end
end
