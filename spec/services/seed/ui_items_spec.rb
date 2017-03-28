require 'rails_helper'

describe Seed::UiItems::SubMain do

  let!(:data) do
    {
      "nycAnnualSurvey" => {
        "uiItemProperties" => {
          "uiItemType" => "sequenceForm",
          "url" => "url",
          "uiItemAfterSubmit" => "nycAnnualSurvey",
          "bootstrappedAssignments" => {
            "formType": "nycAnnualSurveyForm",
            "formTypeCategory": "survey"
          }
        },
        "childUiItems" => {
          "nycAnnualSurveyQuestion1" => {
            "isFormField" => true,
            "fieldType" => "assignment",
            "formField" => "route",
            "options" => ["test-route-1", "test-route-2", "test-route-3"],
            "uiItemProperties" => {
              "answerFormat" => "multipleChoice",
              "automatedCheckInCheckOut" => true,
              "formFieldSectionType" => "routeSelect",
              "prompt" => "Tap on the map route you are currently on",
              "spokenQuestionOrGuess" => "spokenQuestion",
              "uiItemType" => "sequenceFormElement"
            }
          },
          "nycAnnualSurveyQuestion2" => {
            "isFormField" => true,
            "fieldType" => "string",
            "formField" => "question14",
            "uiItemProperties" => {
              "answerFormat" => "multiline",
              "formFieldDependencies" => {
                "route" => "route1",
                "_OR" => {
                  "team": "team1",
                  "site": "site1"
                }
              },
              "formFieldSectionType" => "textInput",
              "placeholder" => "Enter a description here",
              "prompt" => "Location description details?",
              "spokenQuestionOrGuess" => "guess",
              "uiItemType" => "sequenceFormElement"
            }
          }
        }
      }
    }
  end

  def subject
    Seed::UiItems::SubMain.helper(data)
  end

  let!(:route) { FormField.create(name: 'route', field_type: 'string')}
  let!(:team) { FormField.create(name: 'team', field_type: 'string')}
  let!(:site) { FormField.create(name: 'site', field_type: 'string')}

  before do
    subject
  end

  describe 'ui_items' do
    it 'creates 3 items' do
      expect(UiItem.all.count).to eq(3)
    end

    it 'creates with form_field_id (just 2 of 3)' do
      expect(UiItem.where.not(form_field_id: nil).count).to eq(2)
    end
  end


  describe 'child_ui_items' do
    it 'creates 2 ui_item_relations' do
      expect(UiItemRelation.all.count).to eq(2)
    end

    it 'both have same parent_ui_item_id' do
      first = UiItemRelation.first.parent_ui_item_id
      second = UiItemRelation.last.parent_ui_item_id
      expect(first).to eq(second)
    end
  end

  describe 'ui_item_properties' do
    context "when it has dependencies" do
      it 'creates new property type formFieldDependencies' do
        uipt = UiItemPropertyType.find_by_name('form_field_dependencies')
        expect(uipt).to be_present
      end

      it 'can find correct dependency from ui_item' do
        ui_item = UiItem.find_by_name('nycAnnualSurveyQuestion2')
        uipt = UiItemPropertyType.find_by_name('form_field_dependencies')
        ui_dependency = ui_item.ui_item_properties.find_by(ui_item_property_type_id: uipt.id, value: "route1")
        expect(ui_dependency).to be_present
      end

      it 'handles higher order dependencies' do
        ui_item = UiItem.find_by_name('nycAnnualSurveyQuestion2')
        uipt = UiItemPropertyType.find_by_name('form_field_dependencies')
        ui_dependency = ui_item.ui_item_properties.find_by(ui_item_property_type_id: uipt.id, value: "_OR")
        uippr = UiItemPropertyPropertyRelation.where(parent_id: ui_dependency.id)
        child_deps = UiItemProperty.where(ui_item_property_type_id: uipt.id, id: uippr.map(&:child_id))
        expect(child_deps.count).to eq(2)
        expect(child_deps.map(&:value)).to match_array(['team1', 'site1'])
      end
    end

    context "for other properties" do
      it 'creates all properties' do
        form = UiItem.find_by_name('nycAnnualSurvey')
        form_element_1 = UiItem.find_by_name('nycAnnualSurveyQuestion1')
        form_element_2 = UiItem.find_by_name('nycAnnualSurveyQuestion2')

        expect(form.ui_item_properties.count).to eq(5)
        expect(form_element_1.ui_item_properties.count).to eq(6)
        expect(form_element_2.ui_item_properties.count).to eq(8)
      end
    end
  end

end
