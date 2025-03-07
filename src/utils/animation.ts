import type {
  TransitionAnimation,
  TransitionAnimationPair,
  TransitionDirectionalAnimations
} from "astro";

export const mainEntranceAnimationIn: TransitionAnimation = {
  name: "mainEntrance",
  duration: "0.5s",
  easing: "easeIn"
};

export const mainEntranceAnimationOut: TransitionAnimation = {
  name: "mainEntranceOut",
  duration: "0.2s",
  easing: "linear"
};

export const mainEntrancePair: TransitionAnimationPair = {
  old: mainEntranceAnimationOut,
  new: mainEntranceAnimationIn
};

export const mainEntrance: TransitionDirectionalAnimations = {
  forwards: mainEntrancePair,
  backwards: mainEntrancePair
};
