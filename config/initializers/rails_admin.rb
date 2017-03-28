RailsAdmin.config do |config|

  ### Popular gems integration

  ## == Devise ==
  # config.authenticate_with do
  #   warden.authenticate! scope: :user
  # end
  # config.current_user_method(&:current_user)

  ## == Cancan ==
  # config.authorize_with :cancan

  ## == Pundit ==
  # config.authorize_with :pundit

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  ### More at https://github.com/sferik/rails_admin/wiki/Base-configuration

  ## == Gravatar integration ==
  ## To disable Gravatar integration in Navigation Bar set to false
  # config.show_gravatar true

  # config.included_models = [
  #   "User",
  # ]
  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app

    ## With an audit adapter, you can add:
    # history_index
    # history_show
  end

  config.navigation_static_label = "Download CSV"

  config.navigation_static_links = {
    'Surface Via Vehicle' => '/download/surface_via_vehicle',
    #'Stations' => '/download/station'
  }

  config.model 'User' do
    list do
      field :first_name
      field :last_name
      field :email
    end
  end

  config.model 'FormField' do
    list do
      field :name
      field :field_type
      field :form_value_options
    end

    show do
      field :name
      field :field_type
      field :options do
        formatted_value{ bindings[:object].get_form_value_options }
      end
    end
  end
  config.model 'FormType' do
    list do
      field :name
      field :submitted_forms
    end

    show do
      field :name
      field :submitted_forms
    end
  end

  config.model 'SubmittedForm' do
    show do
      field :created_at
      field :user
      field :form_type
      field :form_values
    end
  end
end
