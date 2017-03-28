class DropFormTypeCategories < ActiveRecord::Migration[5.0]
  def change
    drop_table :form_type_categories
  end
end
