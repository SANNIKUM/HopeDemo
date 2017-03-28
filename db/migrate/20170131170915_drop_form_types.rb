class DropFormTypes < ActiveRecord::Migration[5.0]
  def change
    drop_table :form_types
  end
end
