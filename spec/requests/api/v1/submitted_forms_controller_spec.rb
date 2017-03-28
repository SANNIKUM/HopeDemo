require 'rails_helper'

describe Api::V1::SubmittedFormsController do

  let!(:url) { '/api/v1/submitted_forms' }


  def json(r)
    JSON.parse(r.body).deep_symbolize_keys
  end

  context 'valid request' do
    let!(:user) do
      User.create(first_name: 'jon', last_name: 'jon', email: 'jon@gmail.com')
    end

    let!(:params) do
      {
        params: {
          requestId: 1,
          formName: "signIn",
          formFields: [
            {name: 'email', value: 'jon@gmail.com'},
            {name: "gender", fieldType: 'string', value: 'male'},
            {name: 'clientId', fieldType: 'string', value: '0.111'},
          ]
        }.to_json
      }
    end

    it 'returns submitted form requestId' do
      post url, params: params
      j = json(response)
      expect(j[:requestId]).to be_present
    end

    it 'does not create new submitted_form if client_id matches old submitted_form' do
      params = {
        params: {
          requestId: 1,
          formName: "signIn",
          formFields: [
            {name: 'email', value: 'jon@gmail.com'},
            {name: "gender", fieldType: 'string', value: 'male'},
            {name: 'clientId', fieldType: 'string', value: '0.111'}
          ]
        }.to_json
      }
      expect(SubmittedForm.count).to eq(0)
      post url, params: params
      expect(SubmittedForm.count).to eq(1)
      post url, params: params
      expect(SubmittedForm.count).to eq(1)
    end
  end
end
