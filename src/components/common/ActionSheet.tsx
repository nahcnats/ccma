import React, { forwardRef, useCallback } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetModalProps, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import colors from 'tailwindcss/colors';

const ActionSheet = forwardRef<BottomSheetModal, BottomSheetModalProps>((props, ref) => {
    const renderBackDrop = useCallback((props: BottomSheetBackdropProps) => {
        return (
            <BottomSheetBackdrop {...props} opacity={0.5} animatedIndex={{ value: 1 }} pressBehavior={"close"} />
        )
    }, []);

    return (
        <BottomSheetModal
            ref={ref}
            {...props}
            containerStyle={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
            }}
            backgroundStyle={{
                backgroundColor: colors.slate[100]
            }}
            backdropComponent={renderBackDrop}
        >
            {props.children}
        </BottomSheetModal>
    );
});

export default ActionSheet;