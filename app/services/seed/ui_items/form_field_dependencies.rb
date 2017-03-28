module Seed::UiItems::FormFieldDependencies

  def self.run(ui_item_name, props)
    ui_item = UiItem.find_by name: ui_item_name
    (props['uiItemProperties']['formFieldDependencies'] || []).each do |key, pre_value|
      self.helper(key, pre_value, true, ui_item.id)
    end
    (props['childUiItems'] || []).each do |child_ui_item_name, child_props|
      self.run(child_ui_item_name, child_props)
    end
  end


  private

  def self.helper(key, pre_value, is_first_order, id)
    key = key.to_s
    ui_item_property_type = UiItemPropertyType.find_or_create_by(name: 'form_field_dependencies', is_singleton: false)

    if key == '_onAssignmentProperty'
      self.handle_assignment_property_dependency(pre_value, id)
      return
    end

    if key == "_OR"
      should_recur = true
      value = key
      form_field_id = nil
    else
      should_recur = false
      form_field_name = key.split("___")[0]
      puts "form_field_name : #{form_field_name}"
      ff = FormField.find_by(name: form_field_name)
      form_field_id = ff.id
      if pre_value == '_notNull'
        value = pre_value
      elsif ff.field_type == 'option'
        value = FormValueOption.find_by(value: pre_value).id
      else
        value = pre_value
      end
    end

    ui_item_property = UiItemProperty.find_or_create_by(form_field_id: form_field_id, value: value, ui_item_property_type: ui_item_property_type)

    if is_first_order
      ui_item_property_relation = UiItemPropertyRelation.find_or_create_by(ui_item_id: id, ui_item_property: ui_item_property)
    else
      UiItemPropertyPropertyRelation.find_or_create_by(parent_id: id, child_id: ui_item_property.id)
    end

    if should_recur
      pre_value.each do |key, pre_value|
        self.helper(key, pre_value, false, ui_item_property_relation.id)
      end
    end
  end

  def self.handle_assignment_property_dependency(pre_value, ui_item_id)
    uipt = UiItemPropertyType.find_or_create_by(name: 'form_field_dependencies', is_singleton: false)
    uip = UiItemProperty.find_or_create_by(form_field_id: nil, value: '_onAssignmentProperty', ui_item_property_type: uipt)

    uipr = UiItemPropertyRelation.find_or_create_by(ui_item_id: ui_item_id, ui_item_property: uip)

    form_field_name = pre_value.keys[0]
    ff = FormField.find_by(name: form_field_name)
    value = pre_value.values[0]

    uip2 = UiItemProperty.find_or_create_by(form_field_id: ff.id, value: value, ui_item_property_type: uipt)
    UiItemPropertyPropertyRelation.find_or_create_by(parent_id: uipr.id, child_id: uip2.id)
  end

end
