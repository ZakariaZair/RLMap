export interface ReplayData {
  ClassIndexes: {
    'Core.Object': number;
    'Engine.Actor': number;
    'Engine.GameReplicationInfo': number;
    'Engine.Info': number;
    'Engine.Pawn': number;
    'Engine.PlayerReplicationInfo': number;
    'Engine.ReplicationInfo': number;
    'Engine.TeamInfo': number;
    'ProjectX.GRI_X': number;
    'ProjectX.NetModeReplicator_X': number;
    'ProjectX.PRI_X': number;
    'ProjectX.Pawn_X': number;
    'TAGame.Ball_TA': number;
    'TAGame.CameraSettingsActor_TA': number;
    'TAGame.CarComponent_Boost_TA': number;
    'TAGame.CarComponent_Dodge_TA': number;
    'TAGame.CarComponent_DoubleJump_TA': number;
    'TAGame.CarComponent_FlipCar_TA': number;
    'TAGame.CarComponent_Jump_TA': number;
    'TAGame.CarComponent_TA': number;
    'TAGame.Car_TA': number;
    'TAGame.CrowdActor_TA': number;
    'TAGame.CrowdManager_TA': number;
    'TAGame.GRI_TA': number;
    'TAGame.GameEvent_Soccar_TA': number;
    'TAGame.GameEvent_TA': number;
    'TAGame.GameEvent_Team_TA': number;
    'TAGame.GameInfo_Soccar_TA': number;
    'TAGame.MatchType_Public_TA': number;
    'TAGame.PRI_TA': number;
    'TAGame.ProductAttribute_Painted_TA': number;
    'TAGame.ProductAttribute_TitleID_TA': number;
    'TAGame.ProductAttribute_UserColor_TA': number;
    'TAGame.RBActor_TA': number;
    'TAGame.RumblePickups_TA': number;
    'TAGame.Team_Soccar_TA': number;
    'TAGame.Team_TA': number;
    'TAGame.VehiclePickup_Boost_TA': number;
    'TAGame.VehiclePickup_TA': number;
    'TAGame.Vehicle_TA': number;
  };
  ClassNetCaches: [
    {
      ObjectIndex: number;
      ParentId: number;
      Id: number;
      Properties: [
        {
          Index: number;
          Id: number;
        }
      ];
    }
  ];
  EngineVersion: number;
  Frames: Frame[];
  Levels: {};
  LicenseeVersion: number;
  Names: {};
  NetVersion: number;
  Objects: {};
  Packages: {};
  Part1Crc: string;
  Part1Length: number;
  Part2Crc: string;
  Properties: {};
  ReplayClass: string;
  TickMarks: {};
}

interface Frame {
  Time: number;
  Delta: number;
  ActorUpdates: ActorUpdate[];
  DeletedActorIds: number[];
}

interface ActorUpdate {
  ClassName?: number;
  Id: number;
  NameId: number;
  InitialPosition?: Coord; 
  "TAGame.RBActor_TA:ReplicatedRBState": {
    AngularVelocity: Coord;
    LinearVelocity: Coord;
    Position: Coord;
    Rotation: Coord;
  }
  TypeName: string;

}

export interface Coord {
  X: number;
  Y: number;
  Z: number;
}


export interface Player {
  position: {
    x: number;
    y: number;
  };
  velocity?: {
    x: number;
    y: number;
  };
  height?: number;
  hitbox?: {
    L: number;
    l: number;
    h: number;
  };
}

export const CORNERS = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 0 },
  3: { x: 0, y: 0 },
  4: { x: 0, y: 0 },
  5: { x: 0, y: 0 },
  6: { x: 0, y: 0 },
  7: { x: 0, y: 0 },
  8: { x: 0, y: 0 },
};

export const BOOSTS = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 0 },
  3: { x: 0, y: 0 },
  4: { x: 0, y: 0 },
  5: { x: 0, y: 0 },
  6: { x: 0, y: 0 },
  7: { x: 0, y: 0 },
  8: { x: 0, y: 0 },
};

export const START_POSITIONS = {
  1: {
    1: { x: 1263, y: 3823, a: 90 },
    2: { x: 1263, y: 4335, a: 90 },
    3: { x: 2543, y: 6126, a: 45 },
  },
  2: {
    1: { x: 1263, y: 3823, a: 90 },
    2: { x: 1263, y: 4335, a: 90 },
    3: { x: 2543, y: 2032, a: 135 },
  },
  3: {
    1: { x: 1263, y: 3823, a: 90 },
    2: { x: 1263, y: 4335, a: 90 },
    3: { x: 495, y: 4079, a: 90 },
  },
  4: {
    1: { x: 1263, y: 3823, a: 90 },
    2: { x: 2543, y: 6126, a: 45 },
    3: { x: 2543, y: 2032, a: 135 },
  },
  5: {
    1: { x: 1263, y: 3823, a: 90 },
    2: { x: 2543, y: 6126, a: 45 },
    3: { x: 495, y: 4079, a: 90 },
  },
  6: {
    1: { x: 1263, y: 3823, a: 90 },
    2: { x: 2543, y: 2032, a: 135 },
    3: { x: 495, y: 4079, a: 90 },
  },
  7: {
    1: { x: 1263, y: 4335, a: 90 },
    2: { x: 2543, y: 6126, a: 45 },
    3: { x: 2543, y: 2032, a: 135 },
  },
  8: {
    1: { x: 1263, y: 4335, a: 90 },
    2: { x: 2543, y: 6126, a: 45 },
    3: { x: 495, y: 4079, a: 90 },
  },
  9: {
    1: { x: 1263, y: 4335, a: 90 },
    2: { x: 2543, y: 2032, a: 135 },
    3: { x: 495, y: 4079, a: 90 },
  },
  10: {
    1: { x: 2543, y: 6126, a: 45 },
    2: { x: 2543, y: 2032, a: 135 },
    3: { x: 495, y: 4079, a: 90 },
  },
};
