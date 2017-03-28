require 'rails_helper'


describe SubmitForm::SubmittedFormAssignments do

  def subject(sf_id)
    SubmitForm::SubmittedFormAssignments.run(sf_id)
  end

  it 'works' do
    asg1 = FactoryGirl.create(:assignment)
    fvo1 = FactoryGirl.create(:form_value_option, assignment: asg1)
    sf = FactoryGirl.create(:submitted_form)
    fv = FactoryGirl.create(:form_value, form_value_option: fvo1, submitted_form: sf)    
    expect(subject(sf.id)).to eq([asg1.id])
  end
end
