class UiItemPropertyRelation < ApplicationRecord
  belongs_to :ui_item
  belongs_to :ui_item_property
end
