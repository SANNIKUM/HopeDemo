# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170202193500) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "access_set_relations", force: :cascade do |t|
    t.integer "assignment_id"
    t.integer "access_set_id"
    t.index ["access_set_id"], name: "index_access_set_relations_on_access_set_id", using: :btree
    t.index ["assignment_id"], name: "index_access_set_relations_on_assignment_id", using: :btree
  end

  create_table "access_sets", force: :cascade do |t|
    t.integer "ui_item_id"
    t.index ["ui_item_id"], name: "index_access_sets_on_ui_item_id", using: :btree
  end

  create_table "accessible_relations", force: :cascade do |t|
    t.integer "assignment_id"
    t.integer "ui_item_relation_id"
    t.index ["assignment_id"], name: "index_accessible_relations_on_assignment_id", using: :btree
    t.index ["ui_item_relation_id"], name: "index_accessible_relations_on_ui_item_relation_id", using: :btree
  end

  create_table "assignment_properties", force: :cascade do |t|
    t.text    "value"
    t.integer "assignment_id"
    t.integer "assignment_property_type_id"
    t.index ["assignment_id"], name: "index_assignment_properties_on_assignment_id", using: :btree
    t.index ["assignment_property_type_id"], name: "index_assignment_properties_on_assignment_property_type_id", using: :btree
  end

  create_table "assignment_property_types", force: :cascade do |t|
    t.string  "name"
    t.string  "label"
    t.boolean "is_singleton"
  end

  create_table "assignment_relation_types", force: :cascade do |t|
    t.string  "name"
    t.text    "description"
    t.integer "assignment_1_type_id"
    t.integer "assignment_2_type_id"
    t.index ["assignment_1_type_id"], name: "index_assignment_relation_types_on_assignment_1_type_id", using: :btree
    t.index ["assignment_2_type_id"], name: "index_assignment_relation_types_on_assignment_2_type_id", using: :btree
  end

  create_table "assignment_relations", force: :cascade do |t|
    t.integer "assignment_1_id"
    t.integer "assignment_2_id"
    t.integer "assignment_relation_type_id"
    t.index ["assignment_1_id"], name: "index_assignment_relations_on_assignment_1_id", using: :btree
    t.index ["assignment_2_id"], name: "index_assignment_relations_on_assignment_2_id", using: :btree
    t.index ["assignment_relation_type_id"], name: "index_assignment_relations_on_assignment_relation_type_id", using: :btree
  end

  create_table "assignment_types", force: :cascade do |t|
    t.string "name"
    t.string "label"
    t.text   "description"
  end

  create_table "assignments", force: :cascade do |t|
    t.string  "name"
    t.string  "label"
    t.integer "assignment_type_id"
    t.index ["assignment_type_id"], name: "index_assignments_on_assignment_type_id", using: :btree
  end

  create_table "automatic_assignment_form_values", force: :cascade do |t|
    t.integer "trigger_type_id"
    t.integer "target_type_id"
    t.index ["target_type_id"], name: "index_automatic_assignment_form_values_on_target_type_id", using: :btree
    t.index ["trigger_type_id"], name: "index_automatic_assignment_form_values_on_trigger_type_id", using: :btree
  end

  create_table "automatic_assignments", force: :cascade do |t|
    t.integer "origin_type_id"
    t.integer "connector_type_id"
    t.integer "target_type_id"
    t.integer "connection_limit"
    t.integer "assignment_relation_type_id"
  end

  create_table "automatic_check_outs", force: :cascade do |t|
    t.integer "trigger_type_id"
    t.integer "target_type_id"
    t.index ["target_type_id"], name: "index_automatic_check_outs_on_target_type_id", using: :btree
    t.index ["trigger_type_id"], name: "index_automatic_check_outs_on_trigger_type_id", using: :btree
  end

  create_table "expected_fields", force: :cascade do |t|
    t.integer "assignment_id"
    t.integer "form_field_id"
    t.index ["assignment_id"], name: "index_expected_fields_on_assignment_id", using: :btree
    t.index ["form_field_id"], name: "index_expected_fields_on_form_field_id", using: :btree
  end

  create_table "form_fields", force: :cascade do |t|
    t.string  "name",               limit: 255
    t.string  "field_type",         limit: 255
    t.string  "label"
    t.integer "assignment_type_id"
    t.index ["assignment_type_id"], name: "index_form_fields_on_assignment_type_id", using: :btree
  end

  create_table "form_fields_value_options", id: false, force: :cascade do |t|
    t.integer "form_field_id",        null: false
    t.integer "form_value_option_id", null: false
  end

  create_table "form_value_options", force: :cascade do |t|
    t.integer "form_field_id"
    t.string  "value"
    t.integer "assignment_id"
    t.string  "label"
    t.index ["assignment_id"], name: "index_form_value_options_on_assignment_id", using: :btree
    t.index ["form_field_id"], name: "index_form_value_options_on_form_field_id", using: :btree
  end

  create_table "form_values", force: :cascade do |t|
    t.integer  "submitted_form_id"
    t.integer  "form_field_id"
    t.integer  "form_value_option_id"
    t.boolean  "boolean_value"
    t.string   "string_value"
    t.text     "text_value"
    t.integer  "integer_value"
    t.decimal  "numeric_value_1"
    t.decimal  "numeric_value_2"
    t.datetime "datetime_value"
    t.index ["form_field_id"], name: "index_form_values_on_form_field_id", using: :btree
    t.index ["form_value_option_id"], name: "index_form_values_on_form_value_option_id", using: :btree
    t.index ["submitted_form_id"], name: "index_form_values_on_submitted_form_id", using: :btree
  end

  create_table "higher_order_assignment_relations", force: :cascade do |t|
    t.integer "assignment_id"
    t.integer "assignment_relation_id"
  end

  create_table "submitted_forms", force: :cascade do |t|
    t.string "request_id"
  end

  create_table "switch_based_check_outs", force: :cascade do |t|
    t.string  "name"
    t.integer "target_assignment_type_id"
    t.integer "helper_assignment_type_id"
    t.index ["helper_assignment_type_id"], name: "index_switch_based_check_outs_on_helper_assignment_type_id", using: :btree
    t.index ["target_assignment_type_id"], name: "index_switch_based_check_outs_on_target_assignment_type_id", using: :btree
  end

  create_table "ui_item_properties", force: :cascade do |t|
    t.integer "ui_item_property_type_id"
    t.integer "form_field_id"
    t.string  "value",                    limit: 255
  end

  create_table "ui_item_property_property_relations", force: :cascade do |t|
    t.integer "parent_id"
    t.integer "child_id"
    t.index ["child_id"], name: "index_ui_item_property_property_relations_on_child_id", using: :btree
    t.index ["parent_id"], name: "index_ui_item_property_property_relations_on_parent_id", using: :btree
  end

  create_table "ui_item_property_relations", force: :cascade do |t|
    t.integer "ui_item_id"
    t.integer "ui_item_property_id"
  end

  create_table "ui_item_property_types", force: :cascade do |t|
    t.string  "name",         limit: 255
    t.boolean "is_singleton"
  end

  create_table "ui_item_relations", force: :cascade do |t|
    t.integer "child_ui_item_id"
    t.integer "parent_ui_item_id"
  end

  create_table "ui_items", force: :cascade do |t|
    t.string  "name",            limit: 255
    t.integer "ui_item_type_id"
    t.integer "form_field_id"
  end

  add_foreign_key "access_set_relations", "access_sets"
  add_foreign_key "access_set_relations", "assignments"
  add_foreign_key "access_sets", "ui_items"
  add_foreign_key "accessible_relations", "assignments"
  add_foreign_key "accessible_relations", "ui_item_relations"
  add_foreign_key "assignment_properties", "assignment_property_types"
  add_foreign_key "assignment_properties", "assignments"
  add_foreign_key "assignment_relation_types", "assignment_types", column: "assignment_1_type_id"
  add_foreign_key "assignment_relation_types", "assignment_types", column: "assignment_2_type_id"
  add_foreign_key "assignment_relations", "assignment_relation_types"
  add_foreign_key "assignment_relations", "assignments", column: "assignment_1_id"
  add_foreign_key "assignment_relations", "assignments", column: "assignment_2_id"
  add_foreign_key "assignments", "assignment_types"
  add_foreign_key "expected_fields", "assignments"
  add_foreign_key "expected_fields", "form_fields"
  add_foreign_key "form_fields", "assignment_types"
  add_foreign_key "form_value_options", "assignments"
  add_foreign_key "form_values", "form_value_options"
end
