import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useCallback } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

import AccordionBase from '@/components/Collapsible/Accordion';

export type Section = {
  renderContent: JSX.Element;
  titleComponent: ReactNode;
  index: number;
};

export const Accordion = ({
  activeSections,
  sections,
  onAccordionChange,
}: {
  activeSections: number[];
  sections: Section[];
  onAccordionChange: (indexes: number[]) => void;
}) => {
  const renderHeader = useCallback(
    (section: Section) => {
      const isActive = activeSections.includes(section.index);
      const isSingleItem = sections.length === 1;

      return (
        <View
          style={tw.style(`border-[#303db4]`, {
            [`border-b`]: isActive,
          })}>
          <View
            style={tw.style(
              `flex-row items-center justify-between w-full px-4 py-3 bg-[#117EFF50] rounded-3xl`,
              {
                [`rounded-b-none`]: isActive,
              },
            )}>
            {section.titleComponent}
            {!isSingleItem && (
              <Ionicons name={isActive ? 'chevron-up' : 'chevron-down'} size={24} color="white" />
            )}
          </View>
        </View>
      );
    },
    [activeSections, sections.length],
  );

  const renderContent = useCallback((section: Section) => {
    return <View style={tw`p-3 bg-[#117EFF50] rounded-b-3xl`}>{section.renderContent}</View>;
  }, []);

  return (
    <AccordionBase
      activeSections={activeSections}
      sections={sections}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={onAccordionChange}
      renderAsFlatList
      containerStyle={{
        backgroundColor: 'transparent',
      }}
      sectionContainerStyle={tw`mb-3 px-3`}
      underlayColor="#117EFF50"
    />
  );
};
