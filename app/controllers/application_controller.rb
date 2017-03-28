class ApplicationController < ActionController::Base
  #protect_from_forgery with: :exception

  def index
    redirect_to rails_admin_path
  end
end
