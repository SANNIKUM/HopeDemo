require 'rails_helper'

describe SoftDeleteSubmittedForm do

  let!(:client_id) { '4.32'}

  let!(:extant) do
    form_type = FactoryGirl.create(:form_type, name: 'great')
    form_field = FactoryGirl.create(:form_field, name: 'clientId', field_type: 'boolean')
    2.times do
      submitted_form = FactoryGirl.create(:submitted_form, form_type: form_type)
      form_value = FactoryGirl.create(:form_value,
                                      string_value: client_id,
                                      form_field: form_field,
                                      submitted_form: submitted_form)
    end
  end

  def subject(client_id)
    SoftDeleteSubmittedForm.run(client_id)
  end

  it 'creates isSoftDeleted values' do
    are_there_extant = subject(client_id)
    ff = FormField.find_by(name: 'isSoftDeleted')
    sfs = SubmittedForm.all
    fvs = FormValue.where(form_field: ff, boolean_value: true, submitted_form: sfs)
    expect(fvs.count).to eq(2)
  end

  it 'returns boolean corresponding to whether extant forms were found' do
    are_there_extant_1 = subject(client_id)
    expect(are_there_extant_1).to eq(true)
    are_there_extant_2 = subject( '5.678' )
    expect(are_there_extant_2).to eq(false)
  end


end
