module Seed::AccessSets

  def self.run
    AccessSetRelation.delete_all
    AccessSet.delete_all

    data = self.access_sets
    data.each do |r|
      access_sets = r[:ui_items].map do |ui_item_name|
        ui_item = UiItem.find_by(name: ui_item_name)
        AccessSet.create(ui_item_id: ui_item.id)
      end

      asgs = r[:assignments].keys.map do |k|
        at_id = AssignmentType.find_or_create_by(name: k.to_s).id
        assignment = Assignment.find_or_create_by(name: r[:assignments][k], assignment_type_id: at_id)
      end

      access_sets.each do |access_set|
        asgs.each do |asg|
          AccessSetRelation.create(access_set: access_set, assignment: asg)
        end
      end
    end
  end

  private

  def self.access_sets
    [
      # SF
      # {
      #   assignments: {
      #     formType: "blankStateAppOpen",
      #   },
      #   ui_items: ["sfUserCheckIn"]
      #   # ui_items: ["sfSurvey"]
      #   # ui_items: ["sfSiteCheckIn"]
      # },
      {
        assignments: {
          formType: "userCheckIn",
          municipality: "sf",
        },
        ui_items: ["sfSiteCheckIn"]
      },
      {
        assignments: {
          formType: "siteCheckIn",
          municipality: "sf"
        },
        ui_items: %w(
          sfSurvey
          sfHome
          sfRouteCheckIn
          sfAfterSiteCheckOutThankYou
        )
      },

      # NYC

      {
        assignments: {
          formType: "blankStateAppOpen",
        },
        ui_items: ["userCheckIn"]
      },
      {
        assignments: {
          formType: "userCheckIn",
          municipality: "nyc"
        },
        ui_items: ["siteCheckIn"]
      },
      {
        assignments: {
          formType: "siteCheckIn",
          municipality: "nyc"
        },
        ui_items: %w(
          hopeAnnualSurvey
          hopeHome
          hopeSummaryPage
          afterHopeAnnualSurveySubmit
          afterSiteCheckOutThankYou
          nycQuarterlyCountHome
          nycQuarterlyCountSurvey
          nycQuarterlyCountSummary
          nycQuarterlyCountAfterSiteCheckOutThankYou
        )
      },
      {
        assignments: {
          formType: "nycQuarterlyCountHomeRefresh",
          municipality: "nyc"
        },
        ui_items: %w(
          nycQuarterlyCountHome
          nycQuarterlyCountSurvey
          nycQuarterlyCountSummary
          nycQuarterlyCountAfterSiteCheckOutThankYou
        )
      },
      {
        assignments: {
          formType: "hopeHomeRefresh",
          municipality: "nyc"
        },
        ui_items: %w(
          hopeAnnualSurvey
          hopeHome
          hopeSummaryPage
          afterHopeAnnualSurveySubmit
          afterSiteCheckOutThankYou
          nycQuarterlyCountHome
          nycQuarterlyCountSurvey
          nycQuarterlyCountSummary
          nycQuarterlyCountAfterSiteCheckOutThankYou
        )
      }
    ]
  end

end
