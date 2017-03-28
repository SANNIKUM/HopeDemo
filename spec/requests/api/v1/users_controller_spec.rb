require 'rails_helper'

describe Api::V1::UsersController do

  let!(:url) { '/api/v1/users' }


  def json(r)
    JSON.parse(r.body).deep_symbolize_keys
  end

  context 'invalid request' do
    let!(:params) do
      {
        "params": {
          requestId: 1,
          formName: "signIn",
          formFields: [
            {name: "firstName", fieldType: 'string', value: 'jon'},
            {name: "lastName", fieldType: 'string', value: 'smith'},
            {name: 'clientId', fieldType: 'string', value: '0.111'}
            # (no email)
          ]
        }.to_json
      }
    end

    it 'returns errors' do
      post url, params: params
      j = json(response)
      expect(j[:errors]).to_not be_empty
    end
  end

  context 'repeat email used' do
    let!(:user) { FactoryGirl.create(:user, email: 'a')}
    let!(:params) do
      {
        'params': {
          requestId: 1,
          formName: 'signIn',
          formFields: [
            {name: 'email', fieldType: 'string', value: 'a'},
            {name: 'firstName', fieldType: 'string', value: 'jangus'},
            {name: 'lastName', fieldType: 'string', value: 'rong'},
            {name: 'clientId', fieldType: 'string', value: '0.222'}
          ]
        }.to_json
      }
    end

    it 'signs user in' do
      post url, params: params
      j = json(response)
      expect(j[:data][:email]).to eq('a')
    end

    it 'updates first name and last name of user' do
      post url, params: params
      j = json(response)
      u = user.reload
      expect(u.first_name).to eq('jangus')
      expect(u.last_name).to eq('rong')
    end
  end

  context 'valid request' do
    let!(:params) do
      {
        "params": {
          requestId: 1,
          formName: "signIn",
          formFields: [
            {name: "firstName", fieldType: 'string', value: 'jon'},
            {name: "lastName", fieldType: 'string', value: 'smith'},
            {name: 'email', fieldType: 'string', value: 'jon@gmail.com'},
            {name: 'clientId', fieldType: 'string', value: '0.333'}
          ]
        }.to_json
      }
    end

    it 'returns user data' do
      post url, params: params
      j = json(response)
      expect(j[:requestId]).to be_present
      expect(j[:data][:first_name]).to eq('jon')
    end
  end
end
