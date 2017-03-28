module Seed::ExpectedFields

  def self.run
    ExpectedField.delete_all
    self.data.each do |hash|
      at = AssignmentType.find_by(name: 'formType')
      asg = Assignment.find_or_create_by(name: hash[:assignment], assignment_type_id: at.id)
      puts "assignment: #{hash[:assignment]}"
      hash[:fields].each do |n|
        puts "creating: #{n}"
        ff = FormField.find_by(name: n)
        ExpectedField.find_or_create_by(assignment_id: asg.id, form_field_id: ff.id)
      end
    end
  end

  private

  def self.data
    [
      # NYC
      {
        assignment: 'userCheckIn',
        fields: ['user', 'formType', 'formTypeCategory', 'municipality', 'submittedAt'],
      },
      {
        assignment: 'siteCheckIn',
        fields: ['site', 'formType', 'formTypeCategory', 'user', 'municipality'],
      },
      {
        assignment: 'routeCheckOut',
        fields: ['user', 'site', 'route', 'formType', 'formTypeCategory', 'municipality', 'submittedAt']
      },
      {
        assignment: 'nycHomeRefresh',
        fields: ['formType', 'formTypeCategory', 'user', 'site', 'municipality'],
      },
      {
        assignment: 'hopeHomeRefresh',
        fields: ['formType', 'formTypeCategory', 'user', 'site', 'municipality'],
      },
      {
        assignment: 'nycQuarterlyCountSurvey',
        fields: %w(
          age
          atOrBetween
          bedding
          buildingNumber
          canning
          clientId
          crossStreet
          direction
          disheveled
          gender
          knownClient
          latitude
          locationInStation
          longitude
          luggage
          notes
          panhandling
          position
          race
          route
          site
          streetAddress
          submittedAt
          team
          useMapLocation
          user
          wheelchair
        )
      },
      {
        assignment: 'hopeAnnualSurvey',
        fields: %w(
          user
          site
          route
          formType
          formTypeCategory
          decoyCode
          awake
          canInterview?
          whereDoYouLive?
          interviewedAlready?
          seemsHomeless
          age?
          sex
          race
          veteran?
          veteranWasActive?
          uniqueCharacteristics
          locationDetails
          yearsHomeless?
          monthsHomeless?
          dontKnowOrRefusedToAnswerChronicity?
          timesHomelessInPast4Years?
          weeksHomeless?
          daysHomeless?
          firstTimeHomeless?
          doYouHaveHome?
          yearsHomelessInPast3Years?
          monthsHomelessInPast3Years?
          weeksHomelessInPast3Years?
          daysHomelessInPast3Years?
          dontKnowOrRefusedToAnswerChronicityForPast3Years?
          submittedAt
          clientId
          latitude
          longitude
        )
      },
      {
        assignment: 'sfSurvey',
        fields: %w(
          user
          site
          route
          formType
          formTypeCategory
          municipality
          latitude
          longitude
          location
          locationIsPark
          isFamily
          position
          genderPresentation
          sfAge
          withPet
          withWheelchairOrWalker
          onStreetOrSidewalk
          inVehicle
          inTent
          inStructureThatIsNotTent
          notes
        )
      }
    ]
  end
end
