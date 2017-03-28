class Api::V1::SubmittedFormsController < ApplicationController


  def create
    data = params[:params].to_snake_keys.deep_symbolize_keys
    request_id = data[:request_id].to_s

    next_package = SubmitForm::Main.run(data)
    render json: {
      data: {
        nodes: CamelizeKeys.run(next_package[:ui_items]),
        edges: CamelizeKeys.run(next_package[:ui_item_relations])
      },
      requestId: request_id
    }
  end


  def soft_delete
    data = params[:params].to_snake_keys.deep_symbolize_keys
    client_id = data[:client_id].to_s
    request_id = data[:request_id].to_s
    extants_found = SoftDeleteSubmittedForm.run(client_id)
    if extants_found
      render json: {data: {}, requestId: request_id, clientId: client_id}
    else
      render json: {data: {}, requestId: nil} # so request is not removed from queue on front-end
    end
  end
end
