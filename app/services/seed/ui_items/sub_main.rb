module Seed::UiItems::SubMain

  def self.run(data, complete_reset)
    data.each do |ui_item_name, props|
      self.seed_ui_item(ui_item_name, props, complete_reset)
    end

    data.each do |ui_item_name, props|
      self.handle_form_field_dependencies(ui_item_name, props)
    end
  end

  def self.handle_form_field_dependencies(*args)
    Seed::UiItems::FormFieldDependencies.run(*args)
  end


  def self.seed_ui_item(ui_item_name, props, complete_reset)
    puts "creating #{ui_item_name}"
    ui_item = UiItem.find_or_create_by(name: ui_item_name)
    self.handle_parent_relations(ui_item, props['parentUiItems']) if props['parentUiItems']
    self.handle_form_field(ui_item, props) if props['isFormField'] || props['formField']
    self.handle_child_ui_items(ui_item, props['childUiItems'], complete_reset)
    self.handle_ui_item_properties(ui_item, props['uiItemProperties'], props['formField'])
    ui_item
  end

  def self.handle_parent_relations(ui_item, parent_ui_items)
    parent_ui_items.each do |name|
      parent = UiItem.find_by(name: name)
      if parent.nil?
        puts "ERROR: parent not found"
      else
        UiItemRelation.find_or_create_by(parent_ui_item_id: parent.id, child_ui_item_id: ui_item.id)
      end
    end
  end

  def self.handle_form_field(ui_item, props)
    puts "  handle form field #{props['formField']}"
    field_type = props['fieldType']
    form_field_name = props['formField']
    form_field_label = props['fieldLabel'] || form_field_name

    if props['uiItemProperties']['uiItemType'] === 'associatedFormField'
      form_field = FormField.find_by(name: form_field_name)
    elsif field_type == 'assignment'
      assignment_type = AssignmentType.find_or_create_by(name: form_field_name)
      form_field = FormField.find_or_create_by(name: form_field_name, label: form_field_label, field_type: 'assignment', assignment_type: assignment_type)
    else
      form_field = FormField.find_or_create_by(name: form_field_name, label: form_field_label, field_type: field_type)
    end

    if field_type == 'option'
      FormFieldValueOption.where(form_field: form_field).delete_all
      props['options'].each do |o|
        if o.class.name === "String"
          value = o
          label = o
        else
          value = o['value']
          label = o['label']
        end
        fvo = FormValueOption.find_or_create_by(value: value, label: label)
        FormFieldValueOption.find_or_create_by(form_field: form_field, form_value_option: fvo)
      end
    end

    ui_item.form_field = form_field
    ui_item.save
  end

  def self.handle_child_ui_items(ui_item, child_ui_items, complete_reset)
    puts "  handle child_ui_items #{child_ui_items.to_json}"
    if child_ui_items.present? or complete_reset
      UiItemRelation.where(parent_ui_item_id: ui_item.id).delete_all
    end
    return if child_ui_items.nil?

    child_ui_items.each do |k, v|
      child_ui_item = self.seed_ui_item(k, v, complete_reset)
      UiItemRelation.find_or_create_by(parent_ui_item_id: ui_item.id, child_ui_item_id: child_ui_item.id)
    end
  end

  def self.handle_ui_item_properties(ui_item, properties, form_field_name)
    puts "  handle ui_item_properties"
    uir = UiItemPropertyRelation.where(ui_item_id: ui_item.id)
    uir.delete_all

    return if properties.nil?

    properties.each do |name, value|
      if name == 'formFieldDependencies'

      elsif name == 'formFieldCollection' || name == 'formFieldsForTotal'
        self.collect_form_fields(ui_item, name, value)
      elsif name == 'bootstrappedAssignments'
        self.handle_bootstrapped_assignments(ui_item, value)
      else
        self.handle_single_property(ui_item, name, value)
      end
    end
  end

  def self.collect_form_fields(ui_item, name, form_field_array)
    uipt = UiItemPropertyType.find_or_create_by(name: name, is_singleton: false)
    form_field_array.each do |ff|
      ff_id = FormField.find_by(name: ff).id
      uip = UiItemProperty.find_or_create_by(value: ff_id, ui_item_property_type: uipt)
      UiItemPropertyRelation.find_or_create_by(ui_item: ui_item, ui_item_property: uip)
    end
  end

  def self.handle_bootstrapped_assignments(ui_item, assignments)
    assignments.each do |type, value|
      assignment_type = AssignmentType.find_or_create_by(name: type)
      form_field = FormField.find_or_create_by(name: type, assignment_type_id: assignment_type.id, field_type: 'assignment')
      arr = value.class.name == "Array" ? value : [value]
      arr.each do |ele|
        assignment = Assignment.find_or_create_by(name: ele, assignment_type: assignment_type)
        self.handle_single_property(ui_item, 'assignments', assignment.id, false)
      end
    end
  end

  def self.handle_single_property(ui_item, name, value, is_singleton=true)
    puts "  handle_single_property #{name}"
    ui_item_property_type = UiItemPropertyType.find_or_create_by(name: name, is_singleton: is_singleton)
    ui_item_property = UiItemProperty.find_or_create_by(value: value, ui_item_property_type: ui_item_property_type)
    UiItemPropertyRelation.find_or_create_by(ui_item: ui_item, ui_item_property: ui_item_property)
  end

end
