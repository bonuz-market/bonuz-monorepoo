import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleProp, View, ViewStyle } from 'react-native';

import { Collapsible } from './Collapsible';

export interface AccordionProps<T> {
  /**
   * An array of sections passed to the render methods
   */
  sections: T[];

  /**
   * A function that should return a renderable representing the header
   */
  renderHeader(content: T, index: number, isActive: boolean): React.ReactElement<{}>;

  /**
   * A function that should return a renderable representing the footer
   */
  renderFooter?(content: T, index: number, isActive: boolean): React.ReactElement<{}>;

  /**
   * A function that should return a renderable representing the section title above the touchable
   */
  renderSectionTitle?(content: T, index: number, isActive: boolean): React.ReactElement<{}>;

  /**
   * A function that should return a renderable representing the content
   */
  renderContent(content: T, index: number, isActive: boolean): React.ReactElement<{}>;

  /**
   * A function that is called when the currently active section(s) are updated.
   */
  onChange(indexes: number[]): void;

  /**
   * Used to extract a unique key for a given item at the specified index. Key is used for caching
   * and as the react key to track item re-ordering. The default extractor checks `item.key`, then
   * falls back to using the index, like React does.
   */
  keyExtractor?: (item: T, index: number) => number | string;

  /**
   * Controls whether user can interact with accordion
   */
  disabled?: boolean;

  /**
   * Expand content from the bottom instead of the top
   *
   * @default false
   */
  expandFromBottom?: boolean;

  /**
   * Allow more than one section to be expanded at a time. Defaults to false for legacy behavior.
   *
   * @default false
   */
  expandMultiple?: boolean;

  /**
   * Control which indices from keyEctractor in the sections array are currently
   * open. If empty, closes all sections.
   */
  activeSections: number[];

  /**
   * The color of the underlay that will show through when tapping on headers.
   *
   * @default black
   */
  underlayColor?: string;

  /**
   * Alignment of the content when transitioning, can be top, center or bottom
   *
   * @default top
   */
  align?: 'top' | 'center' | 'bottom';

  /**
   * Duration of transition in milliseconds
   *
   * @default 300
   */
  duration?: number;

  /**
   * Function or function name from Easing (or tween-functions if < RN 0.8). Collapsible will try to combine Easing functions for you if you name them like tween-functions.
   *
   * @default easeOutCubic
   */
  easing?: string | any;

  /**
   * Optional styling for the section container
   */
  sectionContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Optional styling for the Accordion container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Render the Accordion as a FlatList. Defaults to false for legacy behavior.
   *
   * @default false
   */
  renderAsFlatList?: boolean;

  /**
   * Function called when the animation finished
   */
  onAnimationEnd?: (section: T, key: number) => void;
}

const Accordion = <T,>({
  underlayColor = 'black',
  disabled = false,
  expandFromBottom = false,
  expandMultiple = false,
  keyExtractor = (_, index) => index,
  // eslint-disable-next-line unicorn/no-null
  renderSectionTitle = () => <></>,
  // eslint-disable-next-line unicorn/no-null
  onAnimationEnd = () => null,
  sectionContainerStyle = {},
  renderAsFlatList = false,
  activeSections,
  onChange,
  containerStyle,
  sections,
  renderContent,
  renderHeader,
  renderFooter,
  ...restProps
}: AccordionProps<T>) => {
  const toggleSection = useCallback(
    (section: number) => {
      if (!disabled) {
        let updatedSections = [];

        if (activeSections.includes(section)) {
          updatedSections = activeSections.filter((a) => a !== section);
        } else if (expandMultiple) {
          updatedSections = [...activeSections, section];
        } else {
          updatedSections = [section];
        }

        if (onChange) {
          onChange(updatedSections);
        }
      }
    },
    [activeSections, disabled, expandMultiple, onChange],
  );

  const renderContainer = useCallback(
    (section: T, key: number, renderCollapsible: any) => (
      <View key={key} style={sectionContainerStyle}>
        {renderSectionTitle(section, key, activeSections.includes(key))}

        {expandFromBottom && renderCollapsible(section, key)}

        <Pressable
          onPress={() => toggleSection(key)}
          style={({ pressed }) => ({
            backgroundColor: pressed ? underlayColor : 'transparent',
            borderRadius: 24,
            borderBottomLeftRadius: activeSections.includes(key) ? 0 : 24,
            borderBottomRightRadius: activeSections.includes(key) ? 0 : 24,
          })}
          accessibilityState={{
            expanded: activeSections.includes(key),
          }}>
          {renderHeader(section, key, activeSections.includes(key))}
        </Pressable>

        {!expandFromBottom && renderCollapsible(section, key)}

        {renderFooter?.(section, key, activeSections.includes(key))}
      </View>
    ),
    [
      activeSections,
      expandFromBottom,
      renderFooter,
      renderHeader,
      renderSectionTitle,
      sectionContainerStyle,
      toggleSection,
      underlayColor,
    ],
  );

  const renderCollapsible = useCallback(
    (section: T, key: number) => (
      <Collapsible
        collapsed={!activeSections.includes(key)}
        {...restProps}
        onAnimationEnd={() => onAnimationEnd(section, key)}>
        {renderContent(section, key, activeSections.includes(key))}
      </Collapsible>
    ),
    [activeSections, onAnimationEnd, renderContent, restProps],
  );

  if (renderAsFlatList) {
    return (
      <FlatList
        style={containerStyle}
        data={sections}
        extraData={activeSections}
        nestedScrollEnabled={true}
        keyExtractor={(item, index) => keyExtractor(item, index).toString()}
        renderItem={({ item, index }) => {
          const section = item;
          const key = keyExtractor(item, index);
          return renderContainer(section, Number(key), renderCollapsible);
        }}
        {...restProps}
      />
    );
  }

  return (
    <View style={containerStyle} {...restProps}>
      {sections.map((section, index) => {
        const key = keyExtractor(section, index);
        return renderContainer(section, Number(key), renderCollapsible);
      })}
    </View>
  );
};

export default Accordion;
