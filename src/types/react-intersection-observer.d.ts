declare module 'react-intersection-observer' {
  export interface IntersectionObserverProps {
    /**
     * Element tag to use for the wrapping component
     * @default 'div'
     */
    as?: React.ElementType;
    /**
     * Only trigger the inView callback once
     * @default false
     */
    triggerOnce?: boolean;
    /**
     * ViewRef to be forwarded
     */
    children?: React.ReactNode;
    /**
     * Number between 0 and 1 indicating the the percentage that should be visible before triggering
     * @default 0
     */
    threshold?: number | Array<number>;
    /**
     * Root margin as a string
     * @default '0px 0px 0px 0px'
     */
    rootMargin?: string;
    /**
     * The Intersection Observer interface's read-only root property identifies the Element or Document whose bounds are treated as the bounding box of the viewport for the element which is the observer's target.
     */
    root?: React.RefObject<Element> | null;
    /**
     * Unique identifier for the root element
     */
    rootId?: string;
    /**
     * Call this function whenever the in view state changes
     */
    onChange?: (inView: boolean, entry: IntersectionObserverEntry) => void;
    /**
     * Get notified everytime the intersection value for the element changes
     */
    onEntry?: (entry: IntersectionObserverEntry) => void;
    /**
     * Skip assigning the observer to the ref
     * @default false
     */
    skip?: boolean;
    /**
     * Set the initial value of the inView boolean
     * @default false
     */
    initialInView?: boolean;
    /**
     * Set the delay before the rendering from inside of the viewRef.
     * @default false
     */
    delay?: number;
    /**
     * Enable tracking for visibility of individual elements in the viewport
     * @default true
     */
    trackVisibility?: boolean;
    /**
     * Minimum delay between visibility checks in milliseconds
     * @default 100
     */
    delay?: number;
  }

  export interface HookResponse {
    ref: React.RefCallback<Element> | React.MutableRefObject<Element | null>;
    inView: boolean;
    entry?: IntersectionObserverEntry;
  }

  // Add array-like support for array destructuring
  export type InViewHookResponse = [React.RefObject<Element> | ((instance: Element | null) => void), boolean, IntersectionObserverEntry?] & HookResponse;
  
  export function useInView(): InViewHookResponse;
  export function useInView(props: IntersectionObserverProps): InViewHookResponse;
  export function useInView(ref: React.RefObject<Element>, props?: IntersectionObserverProps): [boolean, IntersectionObserverEntry?];
  export function useInView(refOrProps?: React.RefObject<Element> | IntersectionObserverProps, props?: IntersectionObserverProps): InViewHookResponse | [boolean, IntersectionObserverEntry?];
}
