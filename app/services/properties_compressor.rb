require 'byebug'

module PropertiesCompressor

  def self.run(args)
    Reduce.run({}, self.helper_proc(args), args[:arr])
  end

  private

  def self.helper_proc(args)
    lambda do |acc, ele|
      ele_id = ele.id
      plain_value = true
      ele_hash = ele.attributes

      type = ele.try(args[:type_name])
      key = type.name.to_sym

      if ele.try(:form_field_id) && ele.form_field_id.present?
        plain_value = false
        ele_hash = ele_hash.merge({form_field: Serializers::FormField::Main.run(ele.form_field_id, [], false)})
      end

      if args[:type_name] == 'ui_item_property_type'
        uipr_ids = UiItemPropertyRelation.where(ui_item: args[:ui_item_id], ui_item_property_id: ele_id).ids
        child_ids = UiItemPropertyPropertyRelation.where(parent_id: uipr_ids).map(&:child_id)
        if child_ids.any?
          plain_value = false
          uips = UiItemProperty.where(id: child_ids)
          hash = self.run({arr: uips, type_name: 'ui_item_property_type', ui_item_id: args[:ui_item_id]})
          ele_hash = ele_hash.merge(hash)
        end
      end

      if plain_value
        ele_hash = ele[:value]
      end

      acc[key] = type.is_singleton ? ele_hash : (acc[key] || []).concat([ele_hash])
      acc
    end
  end
end
