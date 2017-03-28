require 'rails_helper'


describe SubmitForm::CollectAssignmentIds do

  def subject(sf_id)
    SubmitForm::CollectAssignmentIds.run(sf_id)
  end

  let!(:assignment_type_1) { FactoryGirl.create(:assignment_type) }
  let!(:assignment_type_2) { FactoryGirl.create(:assignment_type) }
  let!(:asg1) { FactoryGirl.create(:assignment, assignment_type: assignment_type_1) }
  let!(:fvo1) { FactoryGirl.create(:form_value_option, assignment: asg1) }
  let!(:sf) { FactoryGirl.create(:submitted_form) }
  let!(:fv) { FactoryGirl.create(:form_value, form_value_option: fvo1, submitted_form: sf) }

  it 'works in trivial case' do
    expect(subject(sf.id)).to eq([asg1.id])
  end

  it 'gathers assignments related to seed' do
    asg2 = FactoryGirl.create(:assignment, assignment_type: assignment_type_2)
    ar = FactoryGirl.create(:assignment_relation, assignment_1_id: asg1.id, assignment_2_id: asg2.id)
    expect(subject(sf.id)).to match_array([asg1.id, asg2.id])
  end

  it 'if it reaches a set of assignments of a particular type in two different ways, it only takes the intersection of those thus reached' do
    asg2 = FactoryGirl.create(:assignment, assignment_type: assignment_type_2)
    ar = FactoryGirl.create(:assignment_relation, assignment_1_id: asg1.id, assignment_2_id: asg2.id)
    assignment_type_3 = FactoryGirl.create(:assignment_type)
    asg3 = FactoryGirl.create(:assignment, assignment_type: assignment_type_3)
    asg4 = FactoryGirl.create(:assignment, assignment_type: assignment_type_2)
    ar1 = FactoryGirl.create(:assignment_relation, assignment_1_id: asg1.id, assignment_2_id: asg3.id)
    ar2 = FactoryGirl.create(:assignment_relation, assignment_1_id: asg3.id, assignment_2_id: asg2.id)
    ar1 = FactoryGirl.create(:assignment_relation, assignment_1_id: asg1.id, assignment_2_id: asg4.id)
    expect(subject(sf.id)).to match_array([asg1.id, asg2.id, asg3.id])
  end
end
