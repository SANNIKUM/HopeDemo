require 'rails_helper'

describe SubmitForm::AutomaticAssignmentFormValue do

  def subject(*args) SubmitForm::AutomaticAssignmentFormValue.run(*args) end

  def fc(*args) FactoryGirl.create(*args) end

  let!(:sf) { fc(:submitted_form) }
  let!(:at1) { fc(:assignment_type, name: 'at1') }
  let!(:at2) { fc(:assignment_type, name: 'at2') }
  let!(:asg1) { fc(:assignment, name: 'asg1', assignment_type: at1)}
  let!(:asg2) { fc(:assignment, name: 'asg2', assignment_type: at2)}
  let!(:ar1) { fc(:assignment_relation, assignment_1_id: asg1.id, assignment_2_id: asg2.id) }

  let!(:fvo) { fc(:form_value_option, assignment: asg1) }
  let!(:fv) { fc(:form_value, submitted_form: sf, form_value_option: fvo) }

  let!(:aafv) { fc(:automatic_assignment_form_value, trigger_type_id: at1.id, target_type_id: at2.id)}

  it 'works' do
    subject(sf.id)
    fvo = FormValueOption.find_by(assignment: asg2)
    fv = FormValue.find_by(submitted_form: sf, form_value_option: fvo)
    expect(fv).to be_present
  end
end
