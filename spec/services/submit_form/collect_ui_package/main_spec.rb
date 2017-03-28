require 'rails_helper'

describe SubmitForm::CollectUiPackage::Main do

  def fc(*args) FactoryGirl.create(*args) end

  def subject(*args)
    SubmitForm::CollectUiPackage::Main.run(*args).deep_symbolize_keys!
  end

  let!(:sf) { fc(:submitted_form) }
  let!(:asg) { fc(:assignment) }
  let!(:fvo) { fc(:form_value_option, assignment: asg) }
  let!(:fv) { fc(:form_value, form_value_option: fvo, submitted_form: sf) }
  let!(:ui1) { fc(:ui_item) }
  let!(:ui2) { fc(:ui_item) }
  let!(:uir) { fc(:ui_item_relation, parent_ui_item_id: ui1.id, child_ui_item_id: ui2.id)}

  let!(:au) { fc(:assignment_ui_item, assignment: asg, ui_item: ui1) }

  it 'works in trivial case' do
    result = subject(sf.id)
    expect(result).to eq({
      ui_items: [{id: ui1.id}, {id: ui2.id}],
      ui_item_relations: [{id: uir.id, parent_ui_item_id: ui1.id, child_ui_item_id: ui2.id}]
    })
  end
end
