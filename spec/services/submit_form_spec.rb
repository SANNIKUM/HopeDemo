require 'rails_helper'

describe SubmitForm do

  def subject(data)
    SubmitForm.run(data)
  end

  let!(:data) do
    {
      form_name: 'surfaceViaVehicle',
      form_fields: [
        {
          name: 'street',
          field_type: 'string',
          value: 'beaver',
        },
        {
          name: 'user',
          field_type: 'string',
          value: 'jon@gmail.com'
        },
        {
          name: 'coordinates',
          field_type: 'coordinates',
          value: {
            latitude: '1.15231111111111',
            longitude: '7.234'
          }
        },
        {
          name: 'blankField',
          field_type: 'string',
          value: nil,
        }
      ]
    }
  end

  context 'user already exists' do
    let!(:user) do
      FactoryGirl.create(:assignment, name: 'jon@gmail.com')
    end

    before :each do
      @submitted_form = subject(data).reload
    end

    it 'creates submitted form' do
      expect(@submitted_form.id).to be_present
    end

    it 'still creates field when value is blank' do
      expect(FormField.find_by(name: 'blankField')).to be_present
    end

    it 'associates form_type' do
      expect(@submitted_form.form_type.name).to eq('surfaceViaVehicle')
    end

    it 'associates user' do
      expect(@submitted_form.user_name).to eq('jon@gmail.com')
    end

    it 'associates form_values' do
      expect(@submitted_form.form_values.map(&:string_value)).to include('beaver')
    end

    it 'handles coordinates' do
      expect(@submitted_form.form_values.map(&:numeric_value_1)).to include(1.15231111111111)
      expect(@submitted_form.form_values.map(&:numeric_value_2)).to include(7.234)
    end
  end

  context 'user does not exist yet' do
    before :each do
      @submitted_form = subject(data).reload
    end

    it 'creates user' do
      at = AssignmentType.find_by(name: 'user')
      user = Assignment.find_by(assignment_type_id: at.id, name: 'jon@gmail.com')
      expect(user).to be_present
    end

    it 'associates user to form' do
      expect(@submitted_form.reload.user_name).to eq('jon@gmail.com')
    end
  end

  context 'user info not provided' do
    let!(:data) do
      {
        form_name: 'surfaceViaVehicle',
        form_fields: [
          {
            name: 'street',
            field_type: 'string',
            value: 'beaver',
          },
        ]
      }
    end

    before :each do
      @submitted_form = subject(data).reload
    end

    it 'still creates form' do
      expect(@submitted_form.id).to be_present
    end
  end

  context 'coordinates are blank' do
    let!(:data) do
      {
        form_name: 'surfaceViaVehicle',
        form_fields: [
          {
            name: 'email',
            value: 'jon@gmail.com'
          },
          {
            name: 'coordinates',
            field_type: 'coordinates',
            value: nil
          },
        ]
      }
    end

    before :each do
      @submitted_form = subject(data).reload
    end

    it 'creates submitted form' do
      expect(@submitted_form.id).to be_present
    end
  end
end
