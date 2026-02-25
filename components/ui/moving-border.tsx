export const MovingBorder = ({
    duration = 2000,
    rx,
    ry,
    ...otherProps
}: any) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="absolute h-full w-full"
            width="100%"
            height="100%"
            {...otherProps}
        >
            <rect
                fill="none"
                width="100%"
                height="100%"
                rx={rx}
                ry={ry}
            />
        </svg>
    );
};
