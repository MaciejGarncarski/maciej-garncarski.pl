import type {
  TransitionAnimation,
  TransitionAnimationPair,
  TransitionDirectionalAnimations
} from "astro";

export const mainEntranceAnimationIn: TransitionAnimation = {
  name: "mainEntrance",
  easing: "ease-out",
  duration: "0.25s"
};

export const mainEntranceAnimationOut: TransitionAnimation = {
  name: "mainEntrance",
  easing: "ease-out",
  direction: "reverse",
  duration: "0.15s"
};

export const mainEntrancePair: TransitionAnimationPair = {
  old: mainEntranceAnimationOut,
  new: mainEntranceAnimationIn
};

export const mainEntrance: TransitionDirectionalAnimations = {
  forwards: mainEntrancePair,
  backwards: mainEntrancePair
};
