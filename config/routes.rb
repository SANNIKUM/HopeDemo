Rails.application.routes.draw do
  get 'hello_world', to: 'hello_world#index'
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  mount GraphiQL::Rails::Engine, at: "/graphql", graphql_path: "/web_api/graphql"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'application#index'

  get 'download/:assignment_name', to: 'downloads#download'

  get '/loaderio-4f76b04d5bfcf6ad33b57005f60c44aa/', :to => redirect('/loader.html')

  get '/graphql_dev', to: 'application#graphql_dev'

  namespace :web_api do
    post 'graphql', to: 'graphql#create'
  end

  namespace :api do
    namespace :v1 do
      get 'test', to: 'test#test'
      post 'test', to: 'test#post_test'



      post 'users', to: 'users#create'
      post 'submitted_forms', to: 'submitted_forms#create'
      post 'soft_delete', to: 'submitted_forms#soft_delete'
    end
  end
end
