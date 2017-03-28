class WebApi::GraphqlController < ApplicationController

  def create
    puts "params : #{params.to_json}"    
    query_string = params[:query]
    query_variables = ensure_hash(params[:variables])
    result = WebApi::Schema.execute(query_string, variables: query_variables)
    puts '\n\n\n'
    puts result
    puts '\n\n\n'
    render json: result
  end

  private

  def ensure_hash(query_variables)
    if query_variables.blank?
      {}
    elsif query_variables.is_a?(String)
      JSON.parse(query_variables)
    else
      query_variables
    end
  end

end
