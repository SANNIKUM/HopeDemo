require 'rails_helper'

describe LiftAndComposeProc do

  def subject(*args)
    LiftAndComposeProc.proc(*args)
  end

  def proc1
    lambda do |hash|
      {key1: 'value1'}
    end
  end

  def proc2
    lambda do |hash|
      {key2: 'value2'}
    end
  end

  module Module1
    def self.run(hash)
      {key3: 'value3'}
    end
  end

  it 'works for one proc' do
    result = subject(proc1).call({key0: 'value0'})
    expect(result).to eq({key0: 'value0', key1: 'value1'})
  end

  it 'works for two procs' do
    result = subject(proc1, proc2).call({key0: 'value0'})
    expect(result).to eq({
        key0: 'value0',
        key1: 'value1',
        key2: 'value2'
    })
  end

  it 'works for a proc and a module' do
    result = subject(proc1, Module1).call({key0: 'value0'})
    expect(result).to eq({
      key0: 'value0',
      key1: 'value1',
      key3: 'value3'
    })
  end
end
