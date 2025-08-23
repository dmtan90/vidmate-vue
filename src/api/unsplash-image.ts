//https://api.unsplash.com/search/photos?query=Business&per_page=15&page=1
//authorization: Client-ID 2aa9a1e5ea161790ed085b55335b6b6ee8976b46e94b43e4d4432e7af472930f
import { api, searchParams } from "@/config/api";
const UNSPLASH_API_BASE_URL = "https://api.unsplash.com";
const UNSPLASH_API_KEY = "Client-ID 2aa9a1e5ea161790ed085b55335b6b6ee8976b46e94b43e4d4432e7af472930f";

interface UnsplashPhoto {
	id: number;
	width: number;
	height: number;
	links: {
		self: string;
		html: string;
		download: string;
	},
	url: string;
	color: string;
	user: {
		id: string;
		username: string,
		name: string;
		profile_image: {
			small: string;
			medium: string;
			larger: string;
		}
	},
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	liked_by_user: boolean;
	description: string;
}

interface UnsplashSearchResponse {
	total_page: number;
	total: number;
	results: UnsplashPhoto[];
}

// interface UnsplashCuratedResponse {
// 	page: number;
// 	per_page: number;
// 	photos: UnsplashPhoto[];
// 	next_page?: string;
// 	prev_page?: string;
// }

// interface UnsplashResponse: UnsplashPhoto[];

export async function GET(url: string) {
	const params = searchParams(url);
	const query = params.get("query");
	const page = parseInt(params.get("page") || "1");
	const perPage = parseInt(params.get("per_page") || "20");

	const apiKey = import.meta.env.UNSPLASH_API_KEY || UNSPLASH_API_KEY;

	if (!apiKey) {
		return {
			success: false,
			error: "Unsplash API key not configured",
			status: 500
		}
	}

	try {
		let url: string;

		if (query) {
			// Search for specific images
			url = `${UNSPLASH_API_BASE_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
		} else {
			// Get curated images
			url = `${UNSPLASH_API_BASE_URL}/photos?page=${page}&per_page=${perPage}`;
		}

		const response = await fetch(url, {
			headers: {
				Authorization: apiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`Unsplash API error: ${response.status}`);
		}

		const data: UnsplashPhoto[] | UnsplashSearchResponse = await response.json();

		// Transform the data to match the expected format for the video editor
		let transformedPhotos = [];
		if(data.results){
			transformedPhotos = data.results.map((photo) => ({
				id: `unsplash_${photo.id}`,
				details: {
					src: photo.urls.full, // Use large2x for better quality
					width: photo.width,
					height: photo.height,
					photographer: photo.user.name,
					photographer_url: photo.user.profile_image.medium,
					alt: photo.description,
				},
				preview: photo.urls.thumb, // Use thumb for preview
				type: "image" as const,
				metadata: {
					unsplash_id: photo.id,
					avg_color: photo.color,
					original_url: photo.urls.raw,
				},
			}));
		}
		else{
			transformedPhotos = data.map((photo) => ({
				id: `unsplash_${photo.id}`,
				details: {
					src: photo.urls.full, // Use large2x for better quality
					width: photo.width,
					height: photo.height,
					photographer: photo.user.name,
					photographer_url: photo.user.profile_image.medium,
					alt: photo.description,
				},
				preview: photo.urls.thumb, // Use thumb for preview
				type: "image" as const,
				metadata: {
					unsplash_id: photo.id,
					avg_color: photo.color,
					original_url: photo.urls.raw,
				},
			}));
		}
		
		return {
			success: true,
			error: "",
			status: 200,
			data: {
				photos: transformedPhotos,
				total_results: "total" in data ? data.total : 0,
				page: page,
				per_page: perPage,
				next_page: transformedPhotos.length == perPage ? true : false,
				prev_page: page > 1 ? true : false,
			}
		};
	} catch (error) {
		console.error("Unsplash API error:", error);
		return {
			success: false,
			error: "Failed to fetch images from Unsplash",
			status: 500,
		}
	}
}
