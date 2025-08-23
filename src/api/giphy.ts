import axios from "axios";
import { searchParams } from "@/config/api";

const GIPHY_API_GIF_TRENDING = "https://api.giphy.com/v1/gifs/trending";//https://api.giphy.com/v1/gifs/trending?api_key=jCW4qlpLyT3LfzOcNlIAXAHp6vMxvU7f&limit=10&offset=0&rating=g&bundle=messaging_non_clips
const GIPHY_API_GIF_SEARCH = "https://api.giphy.com/v1/gifs/search";//https://api.giphy.com/v1/gifs/search?api_key=jCW4qlpLyT3LfzOcNlIAXAHp6vMxvU7f&q=&limit=10&offset=0&rating=g&lang=en&bundle=messaging_non_clips

const GIPHY_API_STICKER_TRENDING = "https://api.giphy.com/v1/stickers/trending";//https://api.giphy.com/v1/stickers/trending?api_key=jCW4qlpLyT3LfzOcNlIAXAHp6vMxvU7f&limit=10&offset=0&rating=g&bundle=messaging_non_clips
const GIPHY_API_STICKER_SEARCH = "https://api.giphy.com/v1/stickers/search";//https://api.giphy.com/v1/stickers/search?api_key=jCW4qlpLyT3LfzOcNlIAXAHp6vMxvU7f&q=&limit=10&offset=0&rating=g&lang=en&bundle=messaging_non_clips

const GIPHY_API_EMOJI = "https://api.giphy.com/v2/emoji";//https://api.giphy.com/v2/emoji?api_key=jCW4qlpLyT3LfzOcNlIAXAHp6vMxvU7f&limit=10&offset=0

const GIPHY_API_KEY = "jCW4qlpLyT3LfzOcNlIAXAHp6vMxvU7f";
const GIPHY_PUBLIC_KEY = "xEdQlb3f2VJGg0RLUXjBCnaSotJ8fHyW";
const GIPHY_KEY = import.meta.env.GIPHY_API_KEY || GIPHY_PUBLIC_KEY || GIPHY_API_KEY;

enum GiphyType {
	GIF = "gif",
	STICKER = "sticker",
	EMOJI = "emoji",
}

enum GiphyRate {
	G = "g",
	PG = "pg",
	PG13 = "pg-13",
	R = "r"
}

interface GiphyImage {
	"height": string;
	"width": string;
	"size": string;
	"url": string;
	"mp4_size"?: string;
	"mp4"?: string;
	"webp_size"?: string;
	"webp"?: string;
	"frames"?: string;
	"hash"?: string;
}

interface GiphyGIF {
	"type": GiphyType;//gif
	"id": string;
	"url": string;
	"slug": string;
	"bitly_gif_url": string;
	"bitly_url": string;
	"embed_url": string;
	"username": string;
	"source": string;
	"title": string;
	"rating": GiphyRate;
	"content_url": string;
	"source_tld": string;
	"source_post_url": string;
	"is_sticker": number;
	"import_datetime": string;
	"trending_datetime": string;
	"images": {
		"original": GiphyImage;
		"fixed_height": GiphyImage;//h-200
		"fixed_height_downsampled": GiphyImage;//h-200
		"fixed_height_small": GiphyImage;//h-100
		"fixed_width": GiphyImage;//w-200
		"fixed_width_downsampled": GiphyImage;//w-200
		"fixed_width_small": GiphyImage;//w-100
	};
	"alt_text": string;
	"is_low_contrast": boolean;
};

interface GiphyEmoji extends GiphyGIF{
	"images": {
		"original": GiphyImage;
		"downsized": GiphyImage;
		"downsized_large": GiphyImage;
		"downsized_medium": GiphyImage;
		"downsized_small": GiphyImage;
		"downsized_still": GiphyImage;
		"fixed_height": GiphyImage;
		"fixed_height_downsampled": GiphyImage;
		"fixed_height_small": GiphyImage;
		"fixed_height_small_still": GiphyImage;
		"fixed_height_still": GiphyImage;
		"fixed_width": GiphyImage;
		"fixed_width_downsampled": GiphyImage;
		"fixed_width_small": GiphyImage;
		"fixed_width_small_still": GiphyImage;
		"fixed_width_still": GiphyImage;
		"looping": GiphyImage;
		"original_still": GiphyImage;
		"original_mp4": GiphyImage;
		"preview": GiphyImage;
		"preview_gif": GiphyImage;
		"preview_webp": GiphyImage;
		"hd": GiphyImage;
		"480w_still": GiphyImage;
	};
	"emoji_group_id": number;
	"variation": string;//"default"
	"variation_count": number;
}

// interface GiphySearchResponse {
// 	data: GiphyGIF[];
// 	total_results: number;
// 	page: number;
// 	per_page: number;
// 	photos: GIPHYPhoto[];
// 	next_page?: string;
// 	prev_page?: string;
// }

interface GiphyResponse {
	data: GiphyGIF[] | GiphyEmoji[];
	meta: {
		status: number;
		msg: string;
		response_id: string;
	},
	pagination:{
		"total_count": number;
		"count": number;
		"offset": number;
	};
}

export async function GET_GIF(url: string) {
	const params = searchParams(url);
	const query = params.get("query");
	const offset = parseInt(params.get("page") || "0");
	const limit = parseInt(params.get("per_page") || "20");

	const apiKey = GIPHY_KEY;

	if (!apiKey) {
		return {
			success: false,
			error: "GIPHY API key not configured",
			status: 500
		}
	}

	try {
		let url: string;

		if (query) {
			// Search for specific images
			url = `${GIPHY_API_GIF_SEARCH}?api_key=${apiKey}&q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}&rating=g`;
		} else {
			// Get curated images
			url = `${GIPHY_API_GIF_TRENDING}?api_key=${apiKey}&offset=${offset}&limit=${limit}&rating=g`;
		}

		const response = await fetch(url, {
			headers: {
				// Authorization: apiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`GIPHY API error: ${response.status}`);
		}

		const data: GiphyResponse = await response.json();
		if(data.meta.status > 200){
			return {
				success: false,
				error: data.meta.msg,
				status: data.meta.status,
			}
		}

		// Transform the data to match the expected format for the video editor
		const transformedPhotos = data.data.map((gif) => ({
			type: GiphyType.GIF,
			id: `GIPHY_${gif.id}`,
			details: {
				src: gif.images.fixed_height.mp4, // Use mp4
				width: parseInt(gif.images.fixed_height.width),
				height: parseInt(gif.images.fixed_height.height),
				size: parseInt(gif.images.fixed_height.mp4_size),
				alt: gif.alt_text,
			},
			preview: gif.images.fixed_height_small.webp, // Use webp
			metadata: {
				GIPHY_id: gif.id,
				title: gif.title,
				original_url: gif.images.original.mp4,
				source_post_url: gif.source_post_url
			},
		}));

		return {
			success: true,
			error: "",
			status: 200,
			data: {
				photos: transformedPhotos,
				total_results: data.pagination?.total_count ?? 0,
				page: offset,
				per_page: limit,
				next_page: data.pagination?.count == limit,
				prev_page: offset > 0,
			}
		};
	} catch (error) {
		console.error("GIPHY API error:", error);
		return {
			success: false,
			error: "Failed to fetch images from GIPHY",
			status: 500,
		}
	}
}

export async function GET_STICKER(url: string) {
	const params = searchParams(url);
	const query = params.get("query");
	const offset = parseInt(params.get("page") || "0");
	const limit = parseInt(params.get("per_page") || "20");

	const apiKey = GIPHY_KEY;

	if (!apiKey) {
		return {
			success: false,
			error: "GIPHY API key not configured",
			status: 500
		}
	}

	try {
		let url: string;

		if (query) {
			// Search for specific images
			url = `${GIPHY_API_STICKER_SEARCH}?api_key=${apiKey}&q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}&rating=g`;
		} else {
			// Get curated images
			url = `${GIPHY_API_STICKER_TRENDING}?api_key=${apiKey}&offset=${offset}&limit=${limit}&rating=g`;
		}

		const response = await fetch(url, {
			headers: {
				// Authorization: apiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`GIPHY API error: ${response.status}`);
		}

		const data: GiphyResponse = await response.json();
		if(data.meta.status > 200){
			return {
				success: false,
				error: data.meta.msg,
				status: data.meta.status,
			}
		}

		// Transform the data to match the expected format for the video editor
		const transformedPhotos = data.data.map((gif) => ({
			type: GiphyType.STICKER,
			id: `GIPHY_${gif.id}`,
			details: {
				src: gif.images.fixed_height.mp4, // Use mp4
				width: parseInt(gif.images.fixed_height.width),
				height: parseInt(gif.images.fixed_height.height),
				size: parseInt(gif.images.fixed_height.mp4_size),
				alt: gif.alt_text,
			},
			preview: gif.images.fixed_height_small.webp, // Use webp
			metadata: {
				GIPHY_id: gif.id,
				title: gif.title,
				original_url: gif.images.original.mp4,
				source_post_url: gif.source_post_url
			},
		}));

		return {
			success: true,
			error: "",
			status: 200,
			data: {
				photos: transformedPhotos,
				total_results: data.pagination?.total_count ?? 0,
				page: offset,
				per_page: limit,
				next_page: data.pagination?.count == limit,
				prev_page: offset > 0,
			}
		};
	} catch (error) {
		console.error("GIPHY API error:", error);
		return {
			success: false,
			error: "Failed to fetch images from GIPHY",
			status: 500,
		}
	}
}

export async function GET_EMOJI(url: string) {
	const params = searchParams(url);
	const query = params.get("query");
	const offset = parseInt(params.get("page") || "0");
	const limit = parseInt(params.get("per_page") || "20");

	const apiKey = GIPHY_KEY;

	if (!apiKey) {
		return {
			success: false,
			error: "GIPHY API key not configured",
			status: 500
		}
	}

	try {
		let url: string;

		if (query) {
			// Search for specific images
			url = `${GIPHY_API_EMOJI}?api_key=${apiKey}&q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}&rating=g`;
		} else {
			// Get curated images
			url = `${GIPHY_API_EMOJI}?api_key=${apiKey}&offset=${offset}&limit=${limit}&rating=g`;
		}

		const response = await fetch(url, {
			headers: {
				// Authorization: apiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`GIPHY API error: ${response.status}`);
		}

		const data: GiphyResponse = await response.json();
		if(data.meta.status > 200){
			return {
				success: false,
				error: data.meta.msg,
				status: data.meta.status,
			}
		}

		// Transform the data to match the expected format for the video editor
		const transformedPhotos = data.data.map((gif) => ({
			type: GiphyType.STICKER,
			id: `GIPHY_${gif.id}`,
			details: {
				src: gif.images.fixed_height.mp4, // Use mp4
				width: parseInt(gif.images.fixed_height.width),
				height: parseInt(gif.images.fixed_height.height),
				size: parseInt(gif.images.fixed_height.mp4_size),
				alt: gif.alt_text,
			},
			preview: gif.images.fixed_height_small.webp, // Use webp
			metadata: {
				GIPHY_id: gif.id,
				title: gif.title,
				original_url: gif.images.original.mp4,
				source_post_url: gif.source_post_url
			},
		}));

		return {
			success: true,
			error: "",
			status: 200,
			data: {
				photos: transformedPhotos,
				total_results: data.pagination?.total_count ?? 0,
				page: offset,
				per_page: limit,
				next_page: data.pagination?.count == limit,
				prev_page: offset > 0,
			}
		};
	} catch (error) {
		console.error("GIPHY API error:", error);
		return {
			success: false,
			error: "Failed to fetch images from GIPHY",
			status: 500,
		}
	}
}
