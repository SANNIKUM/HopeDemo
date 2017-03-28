require 'rails_helper'


describe SubmitForm::AutomaticAssignments do

  def subject(sf_id)
    SubmitForm::AutomaticAssignments::Main.run(sf_id)
  end

  def helper(origin, connector)
    x = AssignmentRelation.where(assignment_1_id: origin.id, assignment_2_id: connector.id)
    y = AssignmentRelation.where(assignment_1_id: connector.id, assignment_2_id: origin.id)
    x.first || y.first
  end

  let!(:origin_type) { FactoryGirl.create(:assignment_type) }
  let!(:connector_type) { FactoryGirl.create(:assignment_type) }
  let!(:origin) { FactoryGirl.create(:assignment, name: 'origin', assignment_type: origin_type) }
  let!(:connector) { FactoryGirl.create(:assignment, name: 'connector', assignment_type: connector_type) }

  let!(:art) {
    FactoryGirl.create(
      :assignment_relation_type,
      assignment_2_type_id: origin_type.id
    )
  }

  let!(:aa) { FactoryGirl.create(:automatic_assignment, origin_type_id: origin_type.id,
                                                 connector_type_id: connector_type.id,
                                                 assignment_relation_type_id: art.id,
                                                 connection_limit: 2) }
  let!(:sf)   { FactoryGirl.create(:submitted_form) }
  let!(:fvo1) { FactoryGirl.create(:form_value_option, assignment: origin) }
  let!(:fvo2) { FactoryGirl.create(:form_value_option, assignment: connector) }

  let!(:fv1) { FactoryGirl.create(:form_value, submitted_form: sf, form_value_option: fvo1) }
  let!(:fv2) { FactoryGirl.create(:form_value, submitted_form: sf, form_value_option: fvo2) }


  context 'connector_type_id is same as target_type_id' do
    let!(:x) { aa.update(target_type_id: connector_type.id) }
    let!(:art_updated) { art.update(assignment_1_type_id: connector_type.id) }


    it 'creates assignment_relation' do
      ar1 = helper(origin, connector)
      subject(sf.id)
      ar2 = helper(origin, connector)
      expect(ar1).to be_nil
      expect(ar2).to be_present
    end

    it 'creates assignment_relation of correct type' do
      subject(sf.id)
      ar2 = helper(origin, connector)
      expect(ar2.assignment_1_id).to eq(connector.id)
      expect(ar2.assignment_2_id).to eq(origin.id)
      expect(ar2.assignment_relation_type_id).to eq(art.id)
    end
  end

  context 'connector_type_id is NOT same as target_type_id' do

    let!(:target_type) { FactoryGirl.create(:assignment_type, name: 'target_type') }
    let!(:aa_updated) { aa.update(target_type_id: target_type.id) }
    let!(:art_updated) { art.update(assignment_1_type_id: target_type.id) }
    let!(:eligible_target_1) { FactoryGirl.create(:assignment, name: 'eligible_target_1', assignment_type: target_type, name: 'eligible_target_1') }
    let!(:asr1) { FactoryGirl.create(:assignment_relation, assignment_1_id: connector.id, assignment_2_id: eligible_target_1.id) }

    context 'one eligible target' do

      it 'works when target has never been connected to an assignment of origin_type before' do
        ar1 = helper(origin, eligible_target_1)
        subject(sf.id)
        ar2 = helper(origin, eligible_target_1)
        expect(ar1).to be_nil
        expect(ar2).to be_present
      end

      it 'works when target has been connected to one other assignment of origin_type before' do
        another_of_origins_type = FactoryGirl.create(:assignment, assignment_type: origin_type)
        y = FactoryGirl.create(:assignment_relation, assignment_1_id: eligible_target_1.id, assignment_2_id: another_of_origins_type.id)
        ar1 = helper(origin, eligible_target_1)
        subject(sf.id)
        ar2 = helper(origin, eligible_target_1)
        expect(ar1).to be_nil
        expect(ar2).to be_present
      end
    end

    context 'two eligible targets' do
      let!(:eligible_target_2) { FactoryGirl.create(:assignment, assignment_type: target_type, name: 'eligible_target_2')}
      let!(:asr2) { FactoryGirl.create(:assignment_relation, assignment_1_id: connector.id, assignment_2_id: eligible_target_2.id) }

      it 'among eligible_targets under connection_limit, it selects one that has most connections' do
        ar1_a = helper(origin, eligible_target_1)
        ar1_b = helper(origin, eligible_target_2)
        subject(sf.id)
        ar2_a = helper(origin, eligible_target_1)
        ar2_b = helper(origin, eligible_target_2)
        expect(ar1_a).to be_nil
        expect(ar1_b).to be_nil
        expect(ar2_a).to be_present
        expect(ar2_b).to be_nil
      end

      context 'one of eligible_targets is at or above connection_limit' do
        let!(:another_of_origins_type_2) { FactoryGirl.create(:assignment, assignment_type: origin_type, name: 'another_of_origins_type_2') }
        let!(:another_of_origins_type_3) { FactoryGirl.create(:assignment, assignment_type: origin_type, name: 'another_of_origins_type_3') }
        let!(:x1) { FactoryGirl.create(:assignment_relation, assignment_1_id: eligible_target_1.id, assignment_2_id: another_of_origins_type_2.id) }
        let!(:x2) { FactoryGirl.create(:assignment_relation, assignment_1_id: eligible_target_1.id, assignment_2_id: another_of_origins_type_3.id) }


        it 'selects an eligible_target that is below connection_limit before it selects one above it' do
          ar1_a = helper(origin, eligible_target_1)
          ar1_b = helper(origin, eligible_target_2)


          subject(sf.id)
          ar2_a = helper(origin, eligible_target_1)
          ar2_b = helper(origin, eligible_target_2)
          expect(ar1_a).to be_nil
          expect(ar1_b).to be_nil
          expect(ar2_a).to be_nil
          expect(ar2_b).to be_present
        end

        it 'among eligible targets over connection_limit, it selects one which fewest connections' do
          another_of_origins_type_4 = FactoryGirl.create(:assignment, assignment_type: origin_type, name: 'another_of_origins_type_4')
          another_of_origins_type_5 = FactoryGirl.create(:assignment, assignment_type: origin_type, name: 'another_of_origins_type_5')
          another_of_origins_type_6 = FactoryGirl.create(:assignment, assignment_type: origin_type, name: 'another_of_origins_type_6')
          FactoryGirl.create(:assignment_relation, assignment_1_id: eligible_target_2.id, assignment_2_id: another_of_origins_type_4.id)
          FactoryGirl.create(:assignment_relation, assignment_1_id: eligible_target_2.id, assignment_2_id: another_of_origins_type_5.id)
          FactoryGirl.create(:assignment_relation, assignment_1_id: eligible_target_2.id, assignment_2_id: another_of_origins_type_6.id)

          ar1_a = helper(origin, eligible_target_1)
          ar1_b = helper(origin, eligible_target_2)
          subject(sf.id)
          ar2_a = helper(origin, eligible_target_1)
          ar2_b = helper(origin, eligible_target_2)
          expect(ar1_a).to be_nil
          expect(ar1_b).to be_nil
          expect(ar2_a).to be_present
          expect(ar2_b).to be_nil
        end
      end
    end
  end
end
