import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useCallback } from 'react';
import { View } from 'react-native';

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
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            height: 64,
            borderRadius: 24,
            backgroundColor: '#117EFF50',
            borderBottomWidth: isActive ? 1 : 0,
            borderBottomRightRadius: isActive ? 0 : 24,
            borderBottomLeftRadius: isActive ? 0 : 24,
            borderBottomColor: '#394ac4',
          }}>
          {section.titleComponent}
          {!isSingleItem && (
            <Ionicons name={isActive ? 'chevron-up' : 'chevron-down'} size={24} color="white" />
          )}
        </View>
      );
    },
    [activeSections, sections.length],
  );

  const renderContent = useCallback((section: Section) => {
    return (
      <View
        style={{
          padding: 12,
          backgroundColor: '#303db4',
          borderBottomEndRadius: 12,
          borderBottomStartRadius: 12,
        }}>
        {section.renderContent}
      </View>
    );
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
      sectionContainerStyle={{
        paddingHorizontal: 12,
        marginBottom: 12,
      }}
      underlayColor="#117EFF50"
    />
  );
};
