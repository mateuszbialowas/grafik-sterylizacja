const base = "rounded-lg font-medium tracking-[-0.15px] leading-5 disabled:opacity-40";

const variants = {
  secondary: "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50",
  primary: "bg-gray-950 text-white hover:bg-gray-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
  "danger-outline": "bg-white border border-red-600 text-red-600 hover:bg-red-50",
  orange: "bg-orange-600 text-white hover:bg-orange-700",
};

const sizes = {
  md: "h-10 px-5 text-[14px]",
  sm: "h-8 px-3 text-[13px]",
};

export default function Button({ variant = "secondary", size = "md", className, children, ...props }) {
  return (
    <button className={base + " " + sizes[size] + " " + variants[variant] + (className ? " " + className : "")} {...props}>
      {children}
    </button>
  );
}
