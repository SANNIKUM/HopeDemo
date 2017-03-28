module SubmitForm::CollectUiPackage::Main

  def self.run(sf_id)
    asg_ids = self.collect_assignment_ids(sf_id)
    seed_ui_item_ids = self.collect_seed_ui_item_ids(asg_ids)
    ui_item_relations = self.collect_ui_item_relations(seed_ui_item_ids, asg_ids)
    ui_item_ids = seed_ui_item_ids.concat(ui_item_relations.map{ |x| x[:child_ui_item_id] }).compact.uniq
    ui_item_packages = Map.run(self.ui_item_package(asg_ids), ui_item_ids)
    {
      ui_items: ui_item_packages,
      ui_item_relations: ui_item_relations
    }
  end

  private

  def self.collect_assignment_ids(sf_id)
    SubmitForm::CollectAssignmentIds.run(sf_id)
  end

  def self.collect_seed_ui_item_ids(asg_ids)
    acsrs = AccessSetRelation.where(assignment_id: asg_ids)
    x = acsrs.to_set
    sids = acsrs.map(&:access_set_id)
    sids2 = sids.select do |sid|      
      y = AccessSetRelation.where(access_set_id: sid).to_set
      bool = y.subset?(x)
      bool
    end
    AccessSet.where(id: sids2).map(&:ui_item_id)
  end

  def self.collect_ui_item_relations(*args)
    SubmitForm::CollectUiPackage::CollectUiItemRelations.run(*args)
  end

  def self.ui_item_package(asg_ids)
    lambda do |ui_item_id|
      Serializers::UiItem::MainProc.proc.call(ui_item_id, asg_ids)
    end
  end
end
