import api from "./api";

interface RoomOption {
  text: string;
  votes: number;
  justification: string[];
}

interface RoomResponse {
  _id: string;
  id: string;
  creator: string;
  title: string;
  description: string;
  options: RoomOption[];
  deadline: string;
  voters: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateRoomData {
  title: string;
  description: string;
  options: string[];
  deadline: string;
}

interface VoteData {
  optionIndex: number;
  voterId?: string;
  justification?: string;
}

interface Result {
  option: string;
  votes: number;
  justification?: string[];
}

export const createRoom = async (
  data: CreateRoomData
): Promise<RoomResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.post<RoomResponse>("/rooms", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    ...response.data,
    id: response.data._id || response.data.id,
  };
};

export const getRoom = async (roomId: string): Promise<RoomResponse> => {
  const response = await api.get<RoomResponse>(`/rooms/${roomId}`);
  return {
    ...response.data,
    id: response.data._id || response.data.id,
  };
};

export const vote = async (
  roomId: string,
  data: VoteData
): Promise<{ success: boolean }> => {
  const response = await api.post(`/rooms/${roomId}/vote`, data);
  return response.data;
};

export const submitVote = async (
  roomId: string,
  data: VoteData
): Promise<{ success: boolean }> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await api.post<{ success: boolean }>(
      `/rooms/${roomId}/vote`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to submit vote");
  }
};

export const getResults = async (roomId: string): Promise<Result[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.get<{ results: Result[] }>(
    `/rooms/${roomId}/results`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.results;
};
