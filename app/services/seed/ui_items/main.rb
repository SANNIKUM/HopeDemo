module Seed::UiItems::Main

  def self.complete
    # Dont do anything which would disrupt archival submitted_forms
    AccessSetRelation.delete_all
    AccessSet.delete_all
    UiItemPropertyRelation.delete_all
    UiItemProperty.delete_all
    UiItemPropertyType.delete_all
    UiItem.delete_all
    UiItemRelation.delete_all
    FormFieldValueOption.delete_all
    self.helper('complete')
    Seed::AccessSets.run
    Seed::ExpectedFields.run
  end

  def self.part
    self.helper('part')
  end

  private

  def self.helper(filename)
    data = ActiveSupport::JSON.decode(File.read("app/services/seed/data/ui_items/#{filename}.json"))
    complete_reset = (filename == 'complete')
    Seed::UiItems::SubMain.run(data, complete_reset)
  end
end
